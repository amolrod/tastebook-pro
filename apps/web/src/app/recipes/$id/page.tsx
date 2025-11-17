import { RecipeDetail } from '../../../components/recipes/RecipeDetail';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';

export default function RecipeDetailPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-[#0A0A0A]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Detalle de Receta" />
        <main className="flex-1 overflow-y-auto p-6">
          <RecipeDetail />
        </main>
      </div>
    </div>
  );
}
