import { useTranslations } from "next-intl";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import HushallskalkylContent from "@/features/hushallskalkyl/HushallskalkylContent";

export const HushallskalkylDialog = () => {
  const t = useTranslations("dialog_hushallskalkyl");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Box className="mb-8 p-6 rounded-lg bg-blue-50 dark:bg-blue-950 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">{t("title")}</h2>
          <p className="text-gray-700 dark:text-gray-200 mb-2">
            {t("description")}
          </p>
        </div>
        <DialogTrigger asChild>
          <Button variant="default" size="lg">
            {t("cta")}
          </Button>
        </DialogTrigger>
      </Box>
      <DialogContent className="max-w-lg w-full sm:max-w-xl px-0 sm:px-6">
        <HushallskalkylContent
          showBackButton={false}
          showDialogRelatedContent
        />
        <Box className="flex flex-col gap-4 mt-6">
          <DialogClose asChild>
            <Button variant="outline" className="w-full">
              {t("close")}
            </Button>
          </DialogClose>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
