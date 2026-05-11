import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { FileText, Download, FileSpreadsheet, FilePieChart, Printer, Search, Calendar, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import CustomDatePicker from "../../components/ui/CustomDatePicker";

export default function ReportsPage() {
  const { t } = useTranslation();
  const [reportType, setReportType] = useState("academic");
  const [dateRange, setDateRange] = useState({ start: new Date(), end: new Date() });

  const REPORT_TYPES = useMemo(() => [
    { label: t('reports.categories.academic'), value: "academic" },
    { label: t('reports.categories.attendance'), value: "attendance" },
    { label: t('reports.categories.resources'), value: "resources" },
    { label: t('reports.categories.graduation'), value: "graduation" },
    { label: t('reports.categories.kpi'), value: "kpi" },
  ], [t]);

  const handleExport = async (format) => {
    const toast = (await import("react-hot-toast")).default;
    toast.success(`${t('reports.generate')}: ${reportType} (${format.toUpperCase()})`);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20 px-6 pt-6">
      <PageHeader 
        title={t('reports.title')} 
        subtitle={t('reports.subtitle')}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Configuration Panel */}
        <div className="xl:col-span-1 space-y-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card-premium p-10 space-y-10 shadow-md"
          >
            <div className="flex items-center gap-5">
               <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                  <FilePieChart size={24} />
               </div>
               <h3 className="text-xl font-black text-[var(--color-text-primary)] tracking-tight">
                  {t('reports.config')}
               </h3>
            </div>

            <Select
              label={t('reports.category')}
              options={REPORT_TYPES}
              value={reportType}
              onChange={setReportType}
              icon={<FileText size={20} />}
            />

            <div className="space-y-6">
               <CustomDatePicker 
                  label={t('attendance.start_date')}
                  selected={dateRange.start}
                  onChange={(d) => setDateRange({ ...dateRange, start: d })}
               />
               <CustomDatePicker 
                  label={t('attendance.end_date')}
                  selected={dateRange.end}
                  onChange={(d) => setDateRange({ ...dateRange, end: d })}
               />
            </div>

            <div className="pt-10 border-t border-[var(--color-border)] space-y-4">
               <Button 
                  className="w-full h-16 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all" 
                  icon={<Download size={22} />}
                  onClick={() => handleExport("pdf")}
               >
                  {t('reports.generate')}
               </Button>
               <Button 
                  variant="secondary" 
                  className="w-full h-16 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] opacity-60 hover:opacity-100 border-2" 
                  icon={<Printer size={22} />}
                  onClick={() => window.print()}
               >
                  {t('reports.print')}
               </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-indigo-600 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-600/20 space-y-6 relative overflow-hidden group"
          >
             <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                <FileSpreadsheet size={120} />
             </div>
             <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20">
                <FileSpreadsheet size={28} />
             </div>
             <div className="space-y-2 relative z-10">
                <h4 className="text-2xl font-black tracking-tight">{t('reports.bulk_export')}</h4>
                <p className="text-indigo-100/60 text-sm leading-relaxed font-bold">
                   {t('reports.bulk_desc')}
                </p>
             </div>
             <Button 
               variant="ghost" 
               className="bg-white/10 hover:bg-white/20 text-white w-full h-14 rounded-2xl border border-white/20 font-black text-xs uppercase tracking-widest relative z-10"
               icon={<ChevronRight size={20} />}
               iconPosition="right"
             >
                {t('reports.download_raw')}
             </Button>
          </motion.div>
        </div>

        {/* Preview Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2 card-premium shadow-xl overflow-hidden flex flex-col min-h-[600px]"
        >
          <div className="p-8 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-bg-primary)]/30">
             <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                   <Search size={24} />
                </div>
                <div>
                   <h3 className="font-black text-[var(--color-text-primary)] text-xl tracking-tight">{t('reports.preview')}</h3>
                   <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] opacity-40">{t('reports.preview_hint')}</p>
                </div>
             </div>
             <div className="flex gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-indigo-600/20" />
                <div className="h-2.5 w-2.5 rounded-full bg-indigo-600/20" />
                <div className="h-2.5 w-2.5 rounded-full bg-indigo-600/20" />
             </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-10">
             <div className="relative">
                <div className="absolute -inset-10 bg-indigo-600/5 blur-3xl rounded-full" />
                <div className="w-40 h-40 bg-[var(--color-bg-primary)] rounded-[3rem] border-2 border-dashed border-[var(--color-border)] flex items-center justify-center relative z-10 opacity-20 group">
                   <FileText size={80} className="text-[var(--color-text-secondary)]" />
                </div>
             </div>
             <div className="space-y-4 max-w-sm">
                <p className="text-2xl font-black text-[var(--color-text-primary)] opacity-40 italic tracking-tight">{t('reports.no_preview')}</p>
                <p className="text-sm text-[var(--color-text-secondary)] font-bold opacity-30">
                   {t('reports.preview_desc')}
                </p>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
