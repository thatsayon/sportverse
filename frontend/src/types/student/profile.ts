export interface UserProfileReponse {
  id: string;                  
  profile_pic: string;         
  full_name: string;           
  username: string;            
  email: string;               
  about: string | null;        
  training_sessions: number;   
  coaches_booked: number;      
  hours_trained: number;       
}