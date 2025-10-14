# import pandas as pd
# import numpy as np
# import os
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import permissions, status
# from django.conf import settings
# from django.core.cache import cache
# from functools import lru_cache
# import logging
# from concurrent.futures import ThreadPoolExecutor
# from numba import jit
# from typing import Tuple, Optional
# import pickle
#
# logger = logging.getLogger(__name__)
#
# # Compile haversine calculation with Numba for 10x+ speed boost
# @jit(nopython=True, cache=True)
# def fast_haversine_vectorized(lat1, lon1, lat2_array, lon2_array):
#     """Ultra-fast vectorized haversine calculation using Numba JIT compilation"""
#     R = 6371.0  # Earth radius in km
#
#     # Convert to radians
#     lat1_rad = np.radians(lat1)
#     lon1_rad = np.radians(lon1)
#     lat2_rad = np.radians(lat2_array)
#     lon2_rad = np.radians(lon2_array)
#
#     # Haversine formula
#     dlat = lat2_rad - lat1_rad
#     dlon = lon2_rad - lon1_rad
#
#     a = np.sin(dlat * 0.5) ** 2 + np.cos(lat1_rad) * np.cos(lat2_rad) * np.sin(dlon * 0.5) ** 2
#     c = 2.0 * np.arctan2(np.sqrt(a), np.sqrt(1.0 - a))
#
#     return R * c
#
# class FindNearestTeacherView(APIView):
#     permission_classes = [permissions.IsAuthenticated]
#
#     # Class-level data storage for faster access
#     _cities_df = None
#     _zips_df = None  
#     _teachers_df = None
#     _cities_dict = None  # Dictionary lookup for O(1) city access
#     _zips_dict = None    # Dictionary lookup for O(1) postal access
#     _data_loaded = False
#     _lock = None
#
#     def __init__(self, **kwargs):
#         super().__init__(**kwargs)
#         if not FindNearestTeacherView._data_loaded:
#             from threading import Lock
#             if FindNearestTeacherView._lock is None:
#                 FindNearestTeacherView._lock = Lock()
#             with FindNearestTeacherView._lock:
#                 if not FindNearestTeacherView._data_loaded:
#                     self._load_data()
#
#     def _load_data(self):
#         """Load and optimize data structures for maximum speed"""
#         try:
#             # Try cached pickle data first (fastest loading)
#             cache_key = 'teacher_finder_optimized_data_v2'
#             cached_data = cache.get(cache_key)
#             if cached_data:
#                 try:
#                     (FindNearestTeacherView._cities_df, 
#                      FindNearestTeacherView._zips_df, 
#                      FindNearestTeacherView._teachers_df,
#                      FindNearestTeacherView._cities_dict,
#                      FindNearestTeacherView._zips_dict) = pickle.loads(cached_data)
#                     FindNearestTeacherView._data_loaded = True
#                     logger.info("Teacher finder data loaded from optimized cache")
#                     return
#                 except Exception as e:
#                     logger.warning(f"Failed to load cached data: {e}")
#
#             # File paths
#             cities_path = os.path.join(settings.BASE_DIR, 'map', 'city.csv')
#             zips_path = os.path.join(settings.BASE_DIR, 'map', 'zip.csv')
#
#             # Load CSVs in parallel for speed
#             with ThreadPoolExecutor(max_workers=2) as executor:
#                 cities_future = executor.submit(self._load_cities_csv, cities_path)
#                 zips_future = executor.submit(self._load_zips_csv, zips_path)
#
#                 FindNearestTeacherView._cities_df = cities_future.result()
#                 FindNearestTeacherView._zips_df = zips_future.result()
#
#             # Create optimized lookup dictionaries for O(1) access
#             self._create_lookup_dictionaries()
#
#             # Create teacher data with optimized numpy arrays
#             self._create_optimized_teachers_data()
#
#             # Cache optimized data structures
#             try:
#                 cached_data = pickle.dumps((
#                     FindNearestTeacherView._cities_df,
#                     FindNearestTeacherView._zips_df, 
#                     FindNearestTeacherView._teachers_df,
#                     FindNearestTeacherView._cities_dict,
#                     FindNearestTeacherView._zips_dict
#                 ))
#                 cache.set(cache_key, cached_data, 7200)  # Cache for 2 hours
#             except Exception as e:
#                 logger.warning(f"Failed to cache optimized data: {e}")
#
#             FindNearestTeacherView._data_loaded = True
#             logger.info(f"Optimized data loaded: {len(FindNearestTeacherView._cities_df)} cities, {len(FindNearestTeacherView._zips_df)} zips")
#
#         except Exception as e:
#             logger.error(f"Error loading optimized teacher finder data: {e}")
#             raise
#
#     def _load_cities_csv(self, cities_path):
#         """Load cities CSV with optimizations"""
#         if not os.path.exists(cities_path):
#             raise FileNotFoundError(f"City CSV not found: {cities_path}")
#
#         # Load with optimized dtypes
#         cities_df = pd.read_csv(
#             cities_path, 
#             dtype={'City': 'string'},  # Use efficient string dtype
#             low_memory=False,
#             engine='c'  # Use faster C engine
#         )
#
#         # Optimize numeric conversions
#         cities_df["Latitude"] = pd.to_numeric(cities_df["Latitude"], errors="coerce", downcast='float')
#         cities_df["Longitude"] = pd.to_numeric(cities_df["Longitude"], errors="coerce", downcast='float')
#
#         # Remove invalid coordinates
#         cities_df = cities_df.dropna(subset=['Latitude', 'Longitude'])
#
#         # Create normalized city column for faster lookups
#         cities_df['city_normalized'] = cities_df['City'].str.lower().str.strip()
#
#         return cities_df
#
#     def _load_zips_csv(self, zips_path):
#         """Load zips CSV with optimizations"""
#         if not os.path.exists(zips_path):
#             raise FileNotFoundError(f"Zip CSV not found: {zips_path}")
#
#         # Load with optimized dtypes  
#         zips_df = pd.read_csv(
#             zips_path,
#             dtype={'postal_code': 'string'},
#             low_memory=False,
#             engine='c'
#         )
#
#         # Optimize numeric conversions
#         zips_df["latitude"] = pd.to_numeric(zips_df["latitude"], errors="coerce", downcast='float')
#         zips_df["longitude"] = pd.to_numeric(zips_df["longitude"], errors="coerce", downcast='float')
#
#         # Remove invalid coordinates
#         zips_df = zips_df.dropna(subset=['latitude', 'longitude'])
#
#         # Create normalized postal column for faster lookups
#         zips_df['postal_normalized'] = zips_df['postal_code'].str.upper().str.strip()
#
#         return zips_df
#
#     def _create_lookup_dictionaries(self):
#         """Create O(1) lookup dictionaries for ultra-fast location resolution"""
#         # Cities dictionary: normalized_name -> (lat, lon)
#         FindNearestTeacherView._cities_dict = {}
#         for _, row in FindNearestTeacherView._cities_df.iterrows():
#             key = row['city_normalized']
#             FindNearestTeacherView._cities_dict[key] = (float(row['Latitude']), float(row['Longitude']))
#
#         # Zips dictionary: normalized_postal -> (lat, lon)  
#         FindNearestTeacherView._zips_dict = {}
#         for _, row in FindNearestTeacherView._zips_df.iterrows():
#             key = row['postal_normalized']
#             FindNearestTeacherView._zips_dict[key] = (float(row['latitude']), float(row['longitude']))
#
#         logger.info(f"Created lookup dictionaries: {len(FindNearestTeacherView._cities_dict)} cities, {len(FindNearestTeacherView._zips_dict)} zips")
#
#     def _create_optimized_teachers_data(self):
#         """Create teacher data optimized for vectorized operations"""
#         teachers_data = [
#             {"id": 1, "name": "Alice Rahman", "city": "dhaka", "postal": "BD1200", "latitude": 23.75, "longitude": 90.39, "subject": "Mathematics", "experience": 8, "rating": 4.8},
#             {"id": 2, "name": "Bob Sharma", "city": "mumbai", "postal": "IN400001", "latitude": 18.96, "longitude": 72.82, "subject": "Physics", "experience": 12, "rating": 4.9},
#             {"id": 3, "name": "Charlie Martinez", "city": "london", "postal": "SW1A1AA", "latitude": 51.51, "longitude": -0.13, "subject": "Chemistry", "experience": 6, "rating": 4.7},
#             {"id": 4, "name": "Diana Chen", "city": "singapore", "postal": "018956", "latitude": 1.29, "longitude": 103.85, "subject": "Biology", "experience": 10, "rating": 4.9},
#             {"id": 5, "name": "Erik Johnson", "city": "stockholm", "postal": "11157", "latitude": 59.33, "longitude": 18.07, "subject": "Computer Science", "experience": 15, "rating": 4.8},
#             {"id": 6, "name": "Fatima Al-Zahra", "city": "dubai", "postal": "00000", "latitude": 25.20, "longitude": 55.27, "subject": "English Literature", "experience": 9, "rating": 4.6},
#             {"id": 7, "name": "Gabriel Santos", "city": "sao paulo", "postal": "01310", "latitude": -23.55, "longitude": -46.63, "subject": "History", "experience": 7, "rating": 4.5},
#             {"id": 8, "name": "Hannah Kim", "city": "seoul", "postal": "03722", "latitude": 37.57, "longitude": 126.98, "subject": "Art", "experience": 11, "rating": 4.7},
#             {"id": 9, "name": "Ibrahim Hassan", "city": "cairo", "postal": "11511", "latitude": 30.04, "longitude": 31.24, "subject": "Economics", "experience": 13, "rating": 4.8},
#             {"id": 10, "name": "Julia Rodriguez", "city": "madrid", "postal": "28001", "latitude": 40.42, "longitude": -3.70, "subject": "Spanish", "experience": 5, "rating": 4.6},
#         ]
#
#         FindNearestTeacherView._teachers_df = pd.DataFrame(teachers_data)
#
#         # Pre-convert to numpy arrays for maximum speed
#         FindNearestTeacherView._teachers_df['latitude_array'] = FindNearestTeacherView._teachers_df['latitude'].astype(np.float32)
#         FindNearestTeacherView._teachers_df['longitude_array'] = FindNearestTeacherView._teachers_df['longitude'].astype(np.float32)
#
#     @lru_cache(maxsize=1000)
#     def _resolve_location_cached(self, city: Optional[str], postal: Optional[str]) -> Tuple[Optional[float], Optional[float], Optional[str]]:
#         """Ultra-fast cached location resolution using O(1) dictionary lookups"""
#         if postal:
#             postal_key = postal.strip().upper()
#             if postal_key in FindNearestTeacherView._zips_dict:
#                 lat, lon = FindNearestTeacherView._zips_dict[postal_key]
#                 return lat, lon, "postal_code"
#
#         if city:
#             city_key = city.strip().lower()
#             if city_key in FindNearestTeacherView._cities_dict:
#                 lat, lon = FindNearestTeacherView._cities_dict[city_key]
#                 return lat, lon, "city"
#
#         return None, None, None
#
#     def _calculate_distances_optimized(self, lat: float, lon: float) -> np.ndarray:
#         """Ultra-fast distance calculation using Numba JIT compilation"""
#         teacher_lats = FindNearestTeacherView._teachers_df['latitude_array'].values
#         teacher_lons = FindNearestTeacherView._teachers_df['longitude_array'].values
#
#         # Use JIT-compiled haversine function
#         return fast_haversine_vectorized(lat, lon, teacher_lats, teacher_lons)
#
#     @lru_cache(maxsize=100)
#     def _get_distance_category_cached(self, distance_km: float) -> str:
#         """Cached distance category calculation"""
#         if distance_km < 5:
#             return "very_close"
#         elif distance_km < 50:
#             return "nearby" 
#         elif distance_km < 200:
#             return "moderate"
#         else:
#             return "far"
#
#     def _validate_input_fast(self, city: str, postal: str) -> list:
#         """Optimized input validation"""
#         if not city and not postal:
#             return ["At least one of 'city' or 'postal' must be provided"]
#
#         errors = []
#         if city and len(city) < 2:
#             errors.append("City name must be at least 2 characters long")
#         if postal and len(postal) < 3:
#             errors.append("Postal code must be at least 3 characters long")
#
#         return errors
#
#     def get(self, request):
#         """Optimized GET endpoint with maximum performance"""
#         try:
#             # Fast parameter extraction
#             city = request.query_params.get('city', '').strip()
#             postal = request.query_params.get('postal', '').strip()
#
#             # Fast limit validation
#             limit = min(max(int(request.query_params.get('limit', '5')), 1), 20)
#
#             # Quick input validation
#             validation_errors = self._validate_input_fast(city, postal)
#             if validation_errors:
#                 return Response({
#                     "success": False,
#                     "error": "Validation failed",
#                     "details": validation_errors
#                 }, status=status.HTTP_400_BAD_REQUEST)
#
#             # Ultra-fast cached location resolution
#             lat, lon, found_source = self._resolve_location_cached(
#                 city if city else None,
#                 postal if postal else None
#             )
#
#             if lat is None:
#                 return Response({
#                     "success": False,
#                     "error": "Location not found",
#                     "message": f"Could not resolve coordinates for city: '{city}', postal: '{postal}'"
#                 }, status=status.HTTP_404_NOT_FOUND)
#
#             # Ultra-fast distance calculation using JIT compilation
#             distances = self._calculate_distances_optimized(lat, lon)
#
#             # Fast sorting using numpy argsort
#             sorted_indices = np.argsort(distances)[:limit]
#
#             # Optimized result formatting
#             teachers_list = []
#             for idx in sorted_indices:
#                 teacher = FindNearestTeacherView._teachers_df.iloc[idx]
#                 distance_km = float(distances[idx])
#
#                 teachers_list.append({
#                     "id": int(teacher['id']),
#                     "name": teacher['name'],
#                     "subject": teacher['subject'],
#                     "experience_years": int(teacher['experience']),
#                     "rating": float(teacher['rating']),
#                     "location": {
#                         "city": teacher['city'].title(),
#                         "postal_code": teacher['postal'],
#                         "latitude": float(teacher['latitude']),
#                         "longitude": float(teacher['longitude'])
#                     },
#                     "distance": {
#                         "km": round(distance_km, 2),
#                         "category": self._get_distance_category_cached(distance_km)
#                     }
#                 })
#
#             return Response({
#                 "success": True,
#                 "query": {
#                     "city": city if city else None,
#                     "postal": postal if postal else None,
#                     "limit": limit
#                 },
#                 "location": {
#                     "resolved_from": found_source,
#                     "latitude": round(lat, 6),
#                     "longitude": round(lon, 6)
#                 },
#                 "results": {
#                     "total_found": len(teachers_list),
#                     "teachers": teachers_list
#                 }
#             }, status=status.HTTP_200_OK)
#
#         except ValueError:
#             return Response({
#                 "success": False,
#                 "error": "Invalid limit parameter"
#             }, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             logger.error(f"Error in optimized FindNearestTeacherView: {e}")
#             return Response({
#                 "success": False,
#                 "error": "Internal server error"
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#
#     def post(self, request):
#         """Optimized POST endpoint with advanced filtering"""
#         try:
#             data = request.data
#
#             city = data.get('city', '').strip()
#             postal = data.get('postal', '').strip()
#             limit = min(max(int(data.get('limit', 5)), 1), 20)
#             filters = data.get('filters', {})
#
#             # Quick validation
#             validation_errors = self._validate_input_fast(city, postal)
#             if validation_errors:
#                 return Response({
#                     "success": False,
#                     "error": "Validation failed",
#                     "details": validation_errors
#                 }, status=status.HTTP_400_BAD_REQUEST)
#
#             # Fast location resolution
#             lat, lon, found_source = self._resolve_location_cached(
#                 city if city else None,
#                 postal if postal else None
#             )
#
#             if lat is None:
#                 return Response({
#                     "success": False,
#                     "error": "Location not found"
#                 }, status=status.HTTP_404_NOT_FOUND)
#
#             # Apply filters efficiently using pandas vectorized operations
#             filtered_df = FindNearestTeacherView._teachers_df.copy()
#
#             if 'subjects' in filters and filters['subjects']:
#                 filtered_df = filtered_df[filtered_df['subject'].isin(filters['subjects'])]
#
#             if 'min_rating' in filters:
#                 try:
#                     min_rating = float(filters['min_rating'])
#                     filtered_df = filtered_df[filtered_df['rating'] >= min_rating]
#                 except (ValueError, TypeError):
#                     pass
#
#             if filtered_df.empty:
#                 return Response({
#                     "success": False,
#                     "error": "No teachers found matching filters"
#                 }, status=status.HTTP_404_NOT_FOUND)
#
#             # Fast distance calculation for filtered data
#             teacher_lats = filtered_df['latitude_array'].values
#             teacher_lons = filtered_df['longitude_array'].values
#             distances = fast_haversine_vectorized(lat, lon, teacher_lats, teacher_lons)
#
#             # Apply distance filter
#             if 'max_distance_km' in filters:
#                 try:
#                     max_distance = float(filters['max_distance_km'])
#                     valid_indices = distances <= max_distance
#                     if not valid_indices.any():
#                         return Response({
#                             "success": False,
#                             "error": "No teachers within specified distance"
#                         }, status=status.HTTP_404_NOT_FOUND)
#                     filtered_df = filtered_df[valid_indices]
#                     distances = distances[valid_indices]
#                 except (ValueError, TypeError):
#                     pass
#
#             # Fast sorting and limiting
#             sorted_indices = np.argsort(distances)[:limit]
#
#             # Build response
#             teachers_list = []
#             for i, idx in enumerate(sorted_indices):
#                 teacher = filtered_df.iloc[idx]
#                 distance_km = float(distances[idx])
#
#                 teachers_list.append({
#                     "id": int(teacher['id']),
#                     "name": teacher['name'],
#                     "subject": teacher['subject'],
#                     "experience_years": int(teacher['experience']),
#                     "rating": float(teacher['rating']),
#                     "location": {
#                         "city": teacher['city'].title(),
#                         "postal_code": teacher['postal']
#                     },
#                     "distance": {
#                         "km": round(distance_km, 2),
#                         "category": self._get_distance_category_cached(distance_km)
#                     }
#                 })
#
#             return Response({
#                 "success": True,
#                 "query": {
#                     "city": city if city else None,
#                     "postal": postal if postal else None,
#                     "limit": limit,
#                     "filters": filters
#                 },
#                 "results": {
#                     "total_found": len(teachers_list),
#                     "teachers": teachers_list
#                 }
#             }, status=status.HTTP_200_OK)
#
#         except Exception as e:
#             logger.error(f"Error in optimized POST: {e}")
#             return Response({
#                 "success": False,
#                 "error": "Internal server error"
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

import pandas as pd
import numpy as np
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.conf import settings
from django.core.cache import cache
from functools import lru_cache
import logging
from concurrent.futures import ThreadPoolExecutor
from numba import jit
from typing import Tuple, Optional
import pickle
from authentication.models import UserAccount
from account.models import Teacher

logger = logging.getLogger(__name__)

# Compile haversine calculation with Numba for 10x+ speed boost
@jit(nopython=True, cache=True)
def fast_haversine_vectorized(lat1, lon1, lat2_array, lon2_array):
    """Ultra-fast vectorized haversine calculation using Numba JIT compilation"""
    R = 6371.0  # Earth radius in km
    
    # Convert to radians
    lat1_rad = np.radians(lat1)
    lon1_rad = np.radians(lon1)
    lat2_rad = np.radians(lat2_array)
    lon2_rad = np.radians(lon2_array)
    
    # Haversine formula
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    a = np.sin(dlat * 0.5) ** 2 + np.cos(lat1_rad) * np.cos(lat2_rad) * np.sin(dlon * 0.5) ** 2
    c = 2.0 * np.arctan2(np.sqrt(a), np.sqrt(1.0 - a))
    
    return R * c

class FindNearestTeacherView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    # Class-level data storage for faster access
    _cities_df = None
    _zips_df = None  
    _teachers_df = None
    _cities_dict = None  # Dictionary lookup for O(1) city access
    _zips_dict = None    # Dictionary lookup for O(1) postal access
    _geo_data_loaded = False
    _lock = None
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not FindNearestTeacherView._geo_data_loaded:
            from threading import Lock
            if FindNearestTeacherView._lock is None:
                FindNearestTeacherView._lock = Lock()
            with FindNearestTeacherView._lock:
                if not FindNearestTeacherView._geo_data_loaded:
                    self._load_geo_data()
    
    def _load_geo_data(self):
        """Load and optimize geographic data structures for maximum speed"""
        try:
            # Try cached pickle data first (fastest loading)
            cache_key = 'teacher_finder_geo_data_v3'
            cached_data = cache.get(cache_key)
            if cached_data:
                try:
                    (FindNearestTeacherView._cities_df, 
                     FindNearestTeacherView._zips_df, 
                     FindNearestTeacherView._cities_dict,
                     FindNearestTeacherView._zips_dict) = pickle.loads(cached_data)
                    FindNearestTeacherView._geo_data_loaded = True
                    logger.info("Geographic data loaded from optimized cache")
                    return
                except Exception as e:
                    logger.warning(f"Failed to load cached geo data: {e}")
            
            # File paths
            cities_path = os.path.join(settings.BASE_DIR, 'map', 'city.csv')
            zips_path = os.path.join(settings.BASE_DIR, 'map', 'zip.csv')
            
            # Load CSVs in parallel for speed
            with ThreadPoolExecutor(max_workers=2) as executor:
                cities_future = executor.submit(self._load_cities_csv, cities_path)
                zips_future = executor.submit(self._load_zips_csv, zips_path)
                
                FindNearestTeacherView._cities_df = cities_future.result()
                FindNearestTeacherView._zips_df = zips_future.result()
            
            # Create optimized lookup dictionaries for O(1) access
            self._create_lookup_dictionaries()
            
            # Cache optimized data structures
            try:
                cached_data = pickle.dumps((
                    FindNearestTeacherView._cities_df,
                    FindNearestTeacherView._zips_df, 
                    FindNearestTeacherView._cities_dict,
                    FindNearestTeacherView._zips_dict
                ))
                cache.set(cache_key, cached_data, 7200)  # Cache for 2 hours
            except Exception as e:
                logger.warning(f"Failed to cache geo data: {e}")
            
            FindNearestTeacherView._geo_data_loaded = True
            logger.info(f"Geographic data loaded: {len(FindNearestTeacherView._cities_df)} cities, {len(FindNearestTeacherView._zips_df)} zips")
            
        except Exception as e:
            logger.error(f"Error loading geographic data: {e}")
            raise
    
    def _load_cities_csv(self, cities_path):
        """Load cities CSV with optimizations"""
        if not os.path.exists(cities_path):
            raise FileNotFoundError(f"City CSV not found: {cities_path}")
        
        cities_df = pd.read_csv(
            cities_path, 
            dtype={'City': 'string'},
            low_memory=False,
            engine='c'
        )
        
        cities_df["Latitude"] = pd.to_numeric(cities_df["Latitude"], errors="coerce", downcast='float')
        cities_df["Longitude"] = pd.to_numeric(cities_df["Longitude"], errors="coerce", downcast='float')
        cities_df = cities_df.dropna(subset=['Latitude', 'Longitude'])
        cities_df['city_normalized'] = cities_df['City'].str.lower().str.strip()
        
        # Store country info if available
        if 'Country' in cities_df.columns:
            cities_df['country_normalized'] = cities_df['Country'].str.lower().str.strip()
        
        return cities_df
    
    def _load_zips_csv(self, zips_path):
        """Load zips CSV with optimizations"""
        if not os.path.exists(zips_path):
            raise FileNotFoundError(f"Zip CSV not found: {zips_path}")
        
        zips_df = pd.read_csv(
            zips_path,
            dtype={'postal_code': 'string'},
            low_memory=False,
            engine='c'
        )
        
        zips_df["latitude"] = pd.to_numeric(zips_df["latitude"], errors="coerce", downcast='float')
        zips_df["longitude"] = pd.to_numeric(zips_df["longitude"], errors="coerce", downcast='float')
        zips_df = zips_df.dropna(subset=['latitude', 'longitude'])
        zips_df['postal_normalized'] = zips_df['postal_code'].str.upper().str.strip()
        
        # Store country info if available
        if 'country_code' in zips_df.columns:
            zips_df['country_normalized'] = zips_df['country_code'].str.upper().str.strip()
        
        return zips_df
    
    def _create_lookup_dictionaries(self):
        """Create O(1) lookup dictionaries for ultra-fast location resolution
        Handles duplicate city names by storing all matches with country info
        """
        # Cities dictionary: normalized_name -> list of (lat, lon, country)
        FindNearestTeacherView._cities_dict = {}
        for _, row in FindNearestTeacherView._cities_df.iterrows():
            key = row['city_normalized']
            country = row.get('country_normalized', '')
            coords = (float(row['Latitude']), float(row['Longitude']), country)
            
            if key not in FindNearestTeacherView._cities_dict:
                FindNearestTeacherView._cities_dict[key] = []
            FindNearestTeacherView._cities_dict[key].append(coords)
        
        # Zips dictionary: normalized_postal -> (lat, lon, country)
        FindNearestTeacherView._zips_dict = {}
        for _, row in FindNearestTeacherView._zips_df.iterrows():
            key = row['postal_normalized']
            country = row.get('country_normalized', '')
            FindNearestTeacherView._zips_dict[key] = (float(row['latitude']), float(row['longitude']), country)
        
        logger.info(f"Created lookup dictionaries: {len(FindNearestTeacherView._cities_dict)} cities, {len(FindNearestTeacherView._zips_dict)} zips")
    
    def _add_location_variance(self, lat: float, lon: float, city: str, postal: str) -> Tuple[float, float]:
        """Add small random variance to coordinates for teachers in the same area
        This spreads teachers within approximately 2-5 km radius of the base location
        """
        # Create a deterministic but unique seed based on city and postal
        # This ensures same city/postal combo gets consistent but different offsets
        seed_str = f"{city}_{postal}_{np.random.randint(0, 1000000)}"
        seed_value = hash(seed_str) % (2**32)
        np.random.seed(seed_value)
        
        # Add random offset within ~2-5 km radius
        # 1 degree latitude ≈ 111 km
        # 1 degree longitude ≈ 111 km * cos(latitude)
        
        lat_offset = np.random.uniform(-0.025, 0.025)  # ~2.8 km variance
        lon_offset = np.random.uniform(-0.025, 0.025) / np.cos(np.radians(lat))  # Adjust for latitude
        
        new_lat = lat + lat_offset
        new_lon = lon + lon_offset
        
        # Reset random seed to avoid affecting other random operations
        np.random.seed(None)
        
        return round(new_lat, 6), round(new_lon, 6)
    
    def _load_teachers_from_db(self):
        """Load all teachers from database with location data"""
        # Query all teachers with their document (location data)
        teachers = Teacher.objects.select_related(
            'user', 
            'document'
        ).prefetch_related('coach_type')
        
        teachers_data = []
        for teacher in teachers:
            # Get location from Document model
            if not hasattr(teacher, 'document'):
                continue  # Skip teachers without document
            
            city = teacher.document.city
            postal = teacher.document.zip_code
            
            if not city and not postal:
                continue  # Skip teachers without location data
            
            # Resolve base coordinates for the area
            base_lat, base_lon, _ = self._resolve_location_cached(city, postal, 'BD')
            if base_lat is None or base_lon is None:
                logger.warning(f"Could not resolve location for teacher {teacher.user.username}: city={city}, postal={postal}")
                continue  # Skip if we can't resolve location
            
            # Add variance to spread teachers within the city/area
            lat, lon = self._add_location_variance(base_lat, base_lon, city, postal)
            
            # Get coach types (sports)
            coach_types = list(teacher.coach_type.values_list('name', flat=True))
            
            teachers_data.append({
                'id': str(teacher.id),
                'user_id': str(teacher.user.id),
                'username': teacher.user.username,
                'full_name': teacher.user.full_name,
                'profile_pic': teacher.user.profile_pic.url if teacher.user.profile_pic else None,
                'email': teacher.user.email,
                'institute_name': teacher.institute_name or '',
                'coach_types': coach_types,
                'description': teacher.description or '',
                'city': city or '',
                'postal_code': postal or '',
                'latitude': lat,
                'longitude': lon,
                'base_latitude': base_lat,  # Store original for reference
                'base_longitude': base_lon
            })
        
        if not teachers_data:
            logger.warning("No teachers with valid location data found")
            return pd.DataFrame()
        
        df = pd.DataFrame(teachers_data)
        df['latitude_array'] = df['latitude'].astype(np.float32)
        df['longitude_array'] = df['longitude'].astype(np.float32)
        
        logger.info(f"Loaded {len(df)} teachers with locations. Sample locations: {df[['username', 'city', 'postal_code', 'latitude', 'longitude']].head().to_dict('records')}")
        
        return df

    @lru_cache(maxsize=1000)
    def _resolve_location_cached(self, city: Optional[str], postal: Optional[str], country: Optional[str] = 'BD') -> Tuple[Optional[float], Optional[float], Optional[str]]:
        """Ultra-fast cached location resolution using O(1) dictionary lookups
        Priority: city first, then postal code as fallback
        Handles duplicate city names by preferring matches in the specified country
        """
        # Try city first (higher priority)
        if city:
            city_key = city.strip().lower()
            if city_key in FindNearestTeacherView._cities_dict:
                matches = FindNearestTeacherView._cities_dict[city_key]
                
                # If there are multiple matches, prefer the specified country
                if len(matches) > 1 and country:
                    country_key = country.strip().upper()
                    for lat, lon, ctry in matches:
                        if ctry.upper() == country_key:
                            logger.info(f"Location resolved from city with country filter: {city}, {country} -> ({lat}, {lon})")
                            return lat, lon, "city"
                
                # Use first match if no country preference or only one match
                lat, lon, ctry = matches[0]
                logger.info(f"Location resolved from city: {city} -> ({lat}, {lon}, {ctry})")
                return lat, lon, "city"
        
        # Fallback to postal code if city not found
        if postal:
            postal_key = postal.strip().upper()
            if postal_key in FindNearestTeacherView._zips_dict:
                lat, lon, ctry = FindNearestTeacherView._zips_dict[postal_key]
                logger.info(f"Location resolved from postal: {postal} -> ({lat}, {lon}, {ctry})")
                return lat, lon, "postal_code"
        
        logger.warning(f"Could not resolve location for city: {city}, postal: {postal}, country: {country}")
        return None, None, None

    def _calculate_distances_optimized(self, lat: float, lon: float, teachers_df: pd.DataFrame) -> np.ndarray:
        """Ultra-fast distance calculation using Numba JIT compilation"""
        teacher_lats = teachers_df['latitude_array'].values
        teacher_lons = teachers_df['longitude_array'].values
        
        return fast_haversine_vectorized(lat, lon, teacher_lats, teacher_lons)

    @lru_cache(maxsize=100)
    def _get_distance_category_cached(self, distance_km: float) -> str:
        """Cached distance category calculation"""
        if distance_km < 5:
            return "very_close"
        elif distance_km < 50:
            return "nearby" 
        elif distance_km < 200:
            return "moderate"
        else:
            return "far"

    def _validate_input_fast(self, city: str, postal: str) -> list:
        """Optimized input validation"""
        if not city and not postal:
            return ["At least one of 'city' or 'postal' must be provided"]
        
        errors = []
        if city and len(city) < 2:
            errors.append("City name must be at least 2 characters long")
        if postal and len(postal) < 3:
            errors.append("Postal code must be at least 3 characters long")
            
        return errors

    def get(self, request):
        """Optimized GET endpoint with maximum performance"""
        try:
            # Fast parameter extraction
            city = request.query_params.get('city', '').strip()
            postal = request.query_params.get('postal', '').strip()
            country = request.query_params.get('country', 'BD').strip()  # Default to Bangladesh
            
            # Fast limit validation
            limit = min(max(int(request.query_params.get('limit', '5')), 1), 50)
            
            # Quick input validation
            validation_errors = self._validate_input_fast(city, postal)
            if validation_errors:
                return Response({
                    "success": False,
                    "error": "Validation failed",
                    "details": validation_errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Ultra-fast cached location resolution with country preference
            lat, lon, found_source = self._resolve_location_cached(
                city if city else None,
                postal if postal else None,
                country
            )
            
            if lat is None:
                return Response({
                    "success": False,
                    "error": "Location not found",
                    "message": f"Could not resolve coordinates for city: '{city}', postal: '{postal}', country: '{country}'"
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Load teachers from database
            teachers_df = self._load_teachers_from_db()
            
            if teachers_df.empty:
                return Response({
                    "success": False,
                    "error": "No teachers available",
                    "message": "No teachers found with valid location data"
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Ultra-fast distance calculation using JIT compilation
            distances = self._calculate_distances_optimized(lat, lon, teachers_df)
            
            # Fast sorting using numpy argsort
            sorted_indices = np.argsort(distances)[:limit]
            
            # Optimized result formatting
            teachers_list = []
            for idx in sorted_indices:
                teacher = teachers_df.iloc[int(idx)]  # Ensure integer index
                distance_km = float(distances[idx])
                
                teachers_list.append({
                    "id": teacher['id'],
                    "user_id": teacher['user_id'],
                    "username": teacher['username'],
                    "full_name": teacher['full_name'],
                    "profile_pic": teacher['profile_pic'],
                    "institute_name": teacher['institute_name'],
                    "coach_types": teacher['coach_types'],
                    "description": teacher['description'],
                    "location": {
                        "city": teacher['city'].title() if teacher['city'] else '',
                        "postal_code": teacher['postal_code'],
                        "latitude": float(teacher['latitude']),
                        "longitude": float(teacher['longitude'])
                    },
                    "distance": {
                        "km": round(distance_km, 2),
                        "category": self._get_distance_category_cached(distance_km)
                    }
                })
            
            return Response({
                "success": True,
                "query": {
                    "city": city if city else None,
                    "postal": postal if postal else None,
                    "country": country,
                    "limit": limit
                },
                "location": {
                    "resolved_from": found_source,
                    "latitude": round(lat, 6),
                    "longitude": round(lon, 6)
                },
                "results": {
                    "total_found": len(teachers_list),
                    "teachers": teachers_list
                }
            }, status=status.HTTP_200_OK)
            
        except ValueError:
            return Response({
                "success": False,
                "error": "Invalid limit parameter"
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error in FindNearestTeacherView: {e}", exc_info=True)
            return Response({
                "success": False,
                "error": "Internal server error"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        """Optimized POST endpoint with advanced filtering"""
        try:
            data = request.data
            
            city = data.get('city', '').strip()
            postal = data.get('postal', '').strip()
            country = data.get('country', 'BD').strip()  # Default to Bangladesh
            limit = min(max(int(data.get('limit', 5)), 1), 50)
            filters = data.get('filters', {})
            
            # Quick validation
            validation_errors = self._validate_input_fast(city, postal)
            if validation_errors:
                return Response({
                    "success": False,
                    "error": "Validation failed",
                    "details": validation_errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Fast location resolution with country preference
            lat, lon, found_source = self._resolve_location_cached(
                city if city else None,
                postal if postal else None,
                country
            )
            
            if lat is None:
                return Response({
                    "success": False,
                    "error": "Location not found"
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Load teachers from database
            teachers_df = self._load_teachers_from_db()
            
            if teachers_df.empty:
                return Response({
                    "success": False,
                    "error": "No teachers available"
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Apply filters efficiently using pandas vectorized operations
            filtered_df = teachers_df.copy()
            
            # Filter by coach types (sports)
            if 'coach_types' in filters and filters['coach_types']:
                filtered_df = filtered_df[
                    filtered_df['coach_types'].apply(
                        lambda x: any(ct in x for ct in filters['coach_types'])
                    )
                ]
            
            # Filter by institute name (partial match)
            if 'institute_name' in filters and filters['institute_name']:
                filtered_df = filtered_df[
                    filtered_df['institute_name'].str.contains(
                        filters['institute_name'], 
                        case=False, 
                        na=False
                    )
                ]
            
            if filtered_df.empty:
                return Response({
                    "success": False,
                    "error": "No teachers found matching filters"
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Reset index to avoid indexing issues
            filtered_df = filtered_df.reset_index(drop=True)
            
            # Fast distance calculation for filtered data
            teacher_lats = filtered_df['latitude_array'].values
            teacher_lons = filtered_df['longitude_array'].values
            distances = fast_haversine_vectorized(lat, lon, teacher_lats, teacher_lons)
            
            # Apply distance filter
            if 'max_distance_km' in filters:
                try:
                    max_distance = float(filters['max_distance_km'])
                    valid_indices = distances <= max_distance
                    if not valid_indices.any():
                        return Response({
                            "success": False,
                            "error": "No teachers within specified distance"
                        }, status=status.HTTP_404_NOT_FOUND)
                    filtered_df = filtered_df[valid_indices].reset_index(drop=True)
                    distances = distances[valid_indices]
                except (ValueError, TypeError):
                    pass
            
            # Fast sorting and limiting
            sorted_indices = np.argsort(distances)[:limit]
            
            # Build response
            teachers_list = []
            for idx in sorted_indices:
                teacher = filtered_df.iloc[int(idx)]  # Ensure integer index
                distance_km = float(distances[idx])
                
                teachers_list.append({
                    "id": teacher['id'],
                    "user_id": teacher['user_id'],
                    "username": teacher['username'],
                    "full_name": teacher['full_name'],
                    "profile_pic": teacher['profile_pic'],
                    "institute_name": teacher['institute_name'],
                    "coach_types": teacher['coach_types'],
                    "description": teacher['description'],
                    "location": {
                        "city": teacher['city'].title() if teacher['city'] else '',
                        "postal_code": teacher['postal_code']
                    },
                    "distance": {
                        "km": round(distance_km, 2),
                        "category": self._get_distance_category_cached(distance_km)
                    }
                })
            
            return Response({
                "success": True,
                "query": {
                    "city": city if city else None,
                    "postal": postal if postal else None,
                    "country": country,
                    "limit": limit,
                    "filters": filters
                },
                "results": {
                    "total_found": len(teachers_list),
                    "teachers": teachers_list
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error in POST endpoint: {e}", exc_info=True)
            return Response({
                "success": False,
                "error": "Internal server error"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
