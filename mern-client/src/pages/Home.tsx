import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Brain, DollarSign, Shield, TrendingUp, Mic } from 'lucide-react';

const features = [
  {
    icon: <Brain size={28} />,
    title: 'AI-Powered Parsing',
    description: 'Just describe your expense naturally. Our AI extracts amount, category, and date automatically.',
    gradient: 'from-blue-600/30 to-cyan-600/30',
    border: 'border-blue-500/20',
  },
  {
    icon: <Mic size={28} />,
    title: 'Voice Input',
    description: 'Speak your expenses hands-free. Perfect for logging purchases on the go.',
    gradient: 'from-purple-600/30 to-pink-600/30',
    border: 'border-purple-500/20',
  },
  {
    icon: <DollarSign size={28} />,
    title: 'Smart Budgeting',
    description: 'Visualize spending patterns with interactive charts and AI-generated insights.',
    gradient: 'from-emerald-600/30 to-teal-600/30',
    border: 'border-emerald-500/20',
  },
  {
    icon: <Shield size={28} />,
    title: 'Secure & Private',
    description: 'Your data stays yours. JWT authentication and encrypted storage.',
    gradient: 'from-amber-600/30 to-orange-600/30',
    border: 'border-amber-500/20',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-600/10 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-600/10 border border-brand-500/20 mb-6">
              <Sparkles size={16} className="text-brand-400" />
              <span className="text-sm text-brand-300">AI-Powered Expense Tracking</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-surface-100 mb-6 leading-tight">
              Track Expenses
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                With Natural Language
              </span>
            </h1>

            <p className="text-lg md:text-xl text-surface-400 max-w-2xl mx-auto mb-8">
              Just type or speak naturally: <em>"Spent 450 on lunch"</em>. AI handles the rest.
              No more tedious forms or category selection.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center gap-2"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="btn-secondary text-lg px-8 py-3 inline-flex items-center justify-center"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface-900/40">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-surface-100 mb-4">
              Everything You Need
            </h2>
            <p className="text-surface-400 max-w-2xl mx-auto">
              Powerful features that make expense tracking effortless and insightful.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card p-8 group hover:border-surface-600/60 transition-colors"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} ${feature.border} border flex items-center justify-center mb-5`}
                >
                  <span className="text-brand-400">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-surface-100 mb-2">{feature.title}</h3>
                <p className="text-surface-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="glass-card p-8 md:p-12 text-center">
            <TrendingUp size={48} className="mx-auto text-brand-400 mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold text-surface-100 mb-4">
              Understand Your Spending
            </h2>
            <p className="text-surface-400 max-w-xl mx-auto mb-8">
              Interactive charts show where your money goes. AI insights help you make smarter financial decisions.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="p-4 rounded-xl bg-surface-800/60">
                <p className="text-2xl font-bold text-surface-100">9</p>
                <p className="text-xs text-surface-500">Categories</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-800/60">
                <p className="text-2xl font-bold text-surface-100">AI</p>
                <p className="text-xs text-surface-500">Powered</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-800/60">
                <p className="text-2xl font-bold text-surface-100">100%</p>
                <p className="text-xs text-surface-500">Secure</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-t from-brand-600/10 via-transparent to-transparent">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-surface-100 mb-4">
            Start Tracking Today
          </h2>
          <p className="text-surface-400 mb-8">
            Join thousands who've simplified their expense tracking with AI.
          </p>
          <Link to="/register" className="btn-primary text-lg px-10 py-4 inline-block">
            Create Your Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
