import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Search, Sparkles, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      <section className="py-12 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight text-gov-primary sm:text-4xl lg:text-5xl">
            Welcome to <span className="text-gov-accent">JanSamadhan.ai</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Your trusted national grievance redressal portal. Submit public service
            complaints and track their resolution with AI-powered routing.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/submit">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-xl bg-gov-primary px-6 py-3 font-semibold text-white shadow-lg hover:bg-gov-primaryLight transition-colors"
              >
                <FileText size={20} />
                Submit Complaint
              </motion.button>
            </Link>
            <Link to="/track">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-xl border-2 border-gov-primary px-6 py-3 font-semibold text-gov-primary hover:bg-gov-primary hover:text-white transition-colors"
              >
                <Search size={20} />
                Track Complaint
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="py-12">
        <h2 className="text-center text-2xl font-bold text-gov-primary">
          How JanSamadhan.ai Works
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: FileText,
              title: 'Submit',
              desc: 'Describe your grievance in simple words. Our AI analyzes and routes it to the right department.',
              color: 'bg-gov-accentSoft text-gov-accent',
            },
            {
              icon: Sparkles,
              title: 'AI Routing',
              desc: 'Smart categorization and department assignment for faster resolution.',
              color: 'bg-blue-50 text-gov-primary',
            },
            {
              icon: Search,
              title: 'Track',
              desc: 'Monitor status in real time. Pending → Assigned → In Progress → Resolved.',
              color: 'bg-emerald-50 text-gov-green',
            },
            {
              icon: Shield,
              title: 'Transparent',
              desc: 'Full audit trail and government-grade data protection.',
              color: 'bg-slate-100 text-slate-700',
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className={`inline-flex rounded-lg p-3 ${item.color}`}>
                <item.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="mt-4 font-semibold text-gov-primary">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-gov-accentSoft/50 to-gov-muted p-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-3xl font-bold text-gov-primary">10K+</p>
            <p className="text-sm text-slate-600">Complaints Resolved</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-3xl font-bold text-gov-green">50+</p>
            <p className="text-sm text-slate-600">Departments Connected</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-3xl font-bold text-gov-accent">24/7</p>
            <p className="text-sm text-slate-600">Portal Availability</p>
          </motion.div>
        </div>
      </section>

      <footer className="mt-16 border-t border-slate-200 py-8">
        <div className="flex flex-col items-center gap-4 text-center text-sm text-slate-500 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Government of India • JanSamadhan.ai</span>
          <span>Designed for accessibility, inclusion & transparency</span>
        </div>
      </footer>
    </div>
  );
}
