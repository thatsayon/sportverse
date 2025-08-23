import axios from "axios";

export const getZoomSignature = async (meetingNumber: string, role: number = 0) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/zoom/signature/`,
      { meetingNumber, role }
    );
    return res.data.signature;
  } catch (error) {
    console.error("Error fetching Zoom signature:", error);
    throw error;
  }
};
