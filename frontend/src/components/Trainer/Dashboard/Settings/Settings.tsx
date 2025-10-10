"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocUpload from "@/components/Trainer/UploadFormData";
import PasswordReset from "./PasswordReset/PasswordReset";
import AccountForm from "./Accounts/AccountForm";

const Settings = () => {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 h-12">
          <TabsTrigger
            value="account"
            className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:border-orange-200"
          >
            Account
          </TabsTrigger>
          {/* <TabsTrigger
            className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:border-orange-200"
            value="documents"
          >
            Documents
          </TabsTrigger> */}
          <TabsTrigger
            className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:border-orange-200"
            value="password"
          >
            Password
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <AccountForm />
        </TabsContent>

        {/* <TabsContent value="documents">
          <DocUpload />
        </TabsContent> */}

        <TabsContent value="password">
          <PasswordReset />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
