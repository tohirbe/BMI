import { useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { FileText, Download, FileSpreadsheet, FilePieChart, Printer, Search, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import CustomDatePicker from "../../components/ui/CustomDatePicker";

const REPORT_TYPES = [
  { label: "Academic Performance Summary", value: "academic" },
  { label: "Attendance Detailed Report", value: "attendance" },
  { label: "Faculty Resource Allocation", value: "resources" },
  { label: "Student Graduation Eligibility", value: "graduation" },
  { label: "Departmental KPI Report", value: "kpi" },
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState("academic");
  const [dateRange, setDateRange] = useState({ start: new Date(), end: new Date() });

  const handleExport = async (format) => {
    // This is a placeholder for real export logic
    const toast = (await import("react-hot-toast")).default;
    toast.success(`Exporting ${reportType} report as ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <PageHeader 
        title="Institutional Reports" 
        subtitle="Generate and export comprehensive university data reports"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8"
          >
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
               <FilePieChart className="text-indigo-500" size={20} />
               Report Configuration
            </h3>

            <Select
              label="Select Report Category"
              options={REPORT_TYPES}
              value={reportType}
              onChange={setReportType}
              icon={<FileText size={18} />}
            />

            <div className="space-y-4">
               <CustomDatePicker 
                  label="Start Date"
                  selected={dateRange.start}
                  onChange={(d) => setDateRange({ ...dateRange, start: d })}
               />
               <CustomDatePicker 
                  label="End Date"
                  selected={dateRange.end}
                  onChange={(d) => setDateRange({ ...dateRange, end: d })}
               />
            </div>

            <div className="pt-6 border-t border-slate-50 space-y-3">
               <Button 
                  className="w-full h-14 rounded-2xl" 
                  icon={<Download size={20} />}
                  onClick={() => handleExport("pdf")}
               >
                  Generate Report
               </Button>
               <Button 
                  variant="secondary" 
                  className="w-full h-14 rounded-2xl text-slate-500" 
                  icon={<Printer size={20} />}
                  onClick={() => window.print()}
               >
                  Print View
               </Button>
            </div>
          </motion.div>

          <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200 space-y-4">
             <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <FileSpreadsheet size={24} />
             </div>
             <h4 className="text-xl font-black">Bulk Data Export</h4>
             <p className="text-white/70 text-sm leading-relaxed font-medium">
                Download raw dataset for advanced analysis in Excel or external tools.
             </p>
             <Button variant="ghost" className="bg-white/10 hover:bg-white/20 text-white w-full border border-white/20">
                Download Raw Data (.CSV)
             </Button>
          </div>
        </div>

        {/* Preview Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden flex flex-col"
        >
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                   <Search size={24} />
                </div>
                <div>
                   <h3 className="font-black text-slate-800">Live Preview</h3>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing snippet of generated data</p>
                </div>
             </div>
             <div className="flex gap-2">
                <div className="h-2 w-2 rounded-full bg-slate-200" />
                <div className="h-2 w-2 rounded-full bg-slate-200" />
                <div className="h-2 w-2 rounded-full bg-slate-200" />
             </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6">
             <div className="relative">
                <div className="absolute -inset-4 bg-indigo-500/10 blur-2xl rounded-full" />
                <FileText size={80} className="text-slate-200 relative z-10" />
             </div>
             <div className="space-y-2">
                <p className="text-xl font-black text-slate-400">No report generated yet</p>
                <p className="text-sm text-slate-300 max-w-xs mx-auto">Configure your parameters on the left and click "Generate Report" to see the preview here.</p>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
