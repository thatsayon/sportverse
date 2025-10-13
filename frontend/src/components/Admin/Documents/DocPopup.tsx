"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetDocumentDetailsQuery, useUpdateVerificationMutation } from "@/store/Slices/apiSlices/adminApiSlice";
import Loading from "@/components/Element/Loading";
import { toast } from "sonner";
import { ClickableImage } from "./ImageClickable";

interface DocPopupProps {
  isOpen: boolean;
  setViewDialog: (isOpen: boolean) => void;
  documentId: string;
}




const DocPopup: React.FC<DocPopupProps> = ({ isOpen, setViewDialog, documentId }) => {
  const { data, isLoading, isError } = useGetDocumentDetailsQuery(documentId);
  const [updateStatus] = useUpdateVerificationMutation()
  
  const handleApprove = async () => {
    // Implement approval functionality
    try {
        const respones = await updateStatus({
            id: documentId,
            status: "verified"
        }).unwrap()

        if(respones.status === "verified"){
            toast.success("Document Status Updated")
        }
    } catch (error) {
        const err = error as Error
        toast.error(`The error is: ${err.message}`)
        setViewDialog(false)
    }
    //console.log("Approving document:", documentId);
  };

  const getStatusStyles = (status: "verified" | "unverfied") => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
      case "unverfied":
        return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(value)=>setViewDialog(value)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Trainer Verification Details</DialogTitle>
          <DialogDescription>
            Review the trainer&apos;s verification documents and information.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loading />
          </div>
        ) : isError || !data ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-red-600">Error loading document details</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Teacher Name
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {data.teacher_name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Status
                </label>
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className={`${getStatusStyles(
                      data.status
                    )} border font-medium px-2 py-0.5 text-sm`}
                  >
                    {data.status === "verified" ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  City
                </label>
                <p className="text-gray-900">{data.city}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Zip Code
                </label>
                <p className="text-gray-900">{data.zip_code}</p>
              </div>
            </div>

            {/* Profile Picture */}
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">
                Profile Picture
              </label>
              <div className="flex justify-center">
                <ClickableImage
                  src={data.picture}
                  alt="Profile Picture"
                  className="w-32 h-32"
                />
              </div>
            </div>

            {/* ID Documents */}
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-4">
                ID Documents
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    ID Front
                  </h4>
                  <ClickableImage
                    src={data.id_front}
                    alt="ID Front"
                    className="w-full h-48"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    ID Back
                  </h4>
                  <ClickableImage
                    src={data.id_back}
                    alt="ID Back"
                    className="w-full h-48"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={()=> setViewDialog(false)}>
            Cancel
          </Button>
          {data && (
            <Button
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocPopup;