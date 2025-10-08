"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Trash2, Eye } from "lucide-react";
import { useAppSelector } from "@/store/hooks/hooks";
import { RootState } from "@/store/store";
import { useGetDocumentsQuery } from "@/store/Slices/apiSlices/adminApiSlice";
import Loading from "@/components/Element/Loading";
import ErrorLoadingPage from "@/components/Element/ErrorLoadingPage";
import { TrainerVerification } from "@/types/admin/documents";
import DocPopup from "./DocPopup";

// Status badge styling
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

const VisitorTable: React.FC = () => {
  const [viewDialog, setViewDialog] = useState<boolean>(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>("");

  const { data, isLoading, isError } = useGetDocumentsQuery();
  const documents = data?.results || [];

  const handleView = (id: string) => {
    setSelectedDocumentId(id);
    setViewDialog(true);
  };

  const handleEdit = (id: string) => {
    //console.log(`Edit document with ID: ${id}`);
    // Implement edit functionality
  };

  const handleDelete = (id: string) => {
    //console.log(`Delete document with ID: ${id}`);
    // Implement delete functionality
  };

  const { value } = useAppSelector((state: RootState) => state.state);
  //console.log("Redux state value:", value);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorLoadingPage />;

  return (
    <div className="w-full">
      <h1 className="text-xl md:text-2xl mb-6 font-semibold font-montserrat">
        Trainer Verification Documents
      </h1>
      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium text-gray-600">ID No</TableHead>
              <TableHead className="font-medium text-gray-600">Teacher Name</TableHead>
              <TableHead className="font-medium text-gray-600">City</TableHead>
              <TableHead className="font-medium text-gray-600">Zip Code</TableHead>
              <TableHead className="font-medium text-gray-600">Status</TableHead>
              <TableHead className="font-medium text-gray-600">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {documents.map((document: TrainerVerification) => (
              <TableRow key={document.id} className="hover:bg-gray-50">
                {/* ID */}
                <TableCell className="text-gray-700 font-mono text-sm">
                  {document.id.slice(0, 8)}...
                </TableCell>
                
                {/* Teacher Name */}
                <TableCell className="font-medium text-gray-900">
                  {document.teacher_name}
                </TableCell>

                {/* City */}
                <TableCell className="text-gray-700">{document.city}</TableCell>

                {/* Zip Code */}
                <TableCell className="text-gray-700">{document.zip_code}</TableCell>

                {/* Status */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${getStatusStyles(
                      document.status
                    )} border font-medium px-2 py-0.5 text-sm`}
                  >
                    {document.status === "verified" ? "Verified" : "Unverified"}
                  </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(document.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>                    
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Document View Dialog */}
      <DocPopup
        isOpen={viewDialog}
        setViewDialog={setViewDialog}
        documentId={selectedDocumentId}
      />
    </div>
  );
};

export default VisitorTable;