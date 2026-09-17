import { ArticleEditor } from "@/components/admin/ArticleEditor";

export const metadata = {
  title: "Compose Article | UmrahZone Admin",
};

export default function NewArticlePage() {
  return <ArticleEditor isEditing={false} />;
}
