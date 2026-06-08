import { useState } from 'react';
import { Sparkles, Mic, MicOff, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useExpenses } from '../context/ExpenseContext';

const SUGGESTIONS = [
  'Spent 450 on lunch',
  'Uber ride cost 320',
  'Paid 50 for parking',
  'Netflix subscription 649',
];

export default function QuickAdd() {
  const [text, setText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [listening, setListening] = useState(false);
  const { addTransaction } = useExpenses();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;

    setParsing(true);
    try {
      const transaction = await addTransaction(text);
      toast.success(`Added $${transaction.amount} - ${transaction.category}`);
      setText('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add expense');
    } finally {
      setParsing(false);
    }
  };

  const toggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error('Voice input not supported in this browser');
      return;
    }

    if (listening) {
      (window as any).recognition?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (e: any) => {
      setText(e.results[0][0].transcript);
      setListening(false);
    };
    recognition.onerror = () => {
      toast.error('Voice recognition failed');
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
    (window as any).recognition = recognition;
    setListening(true);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/30 to-cyan-600/30 border border-blue-500/30 flex items-center justify-center">
          <Sparkles size={20} className="text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-surface-100">AI Expense Parser</h2>
          <p className="text-sm text-surface-500">Type naturally - AI handles the rest</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
            disabled={parsing}
            placeholder="e.g. Spent 450 on coffee, Uber ride 320}"
            className="glass-input w-full pr-28 text-base"
            autoFocus
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1.5">
            <button
              type="button"
              onClick={toggleVoice}
              className={`p-2.5 rounded-lg transition-all ${
                listening
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'text-surface-500 hover:text-surface-300 hover:bg-surface-700'
              }`}
              title={listening ? 'Stop listening' : 'Voice input'}
            >
              {listening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button
              type="submit"
              disabled={!text.trim() || parsing}
              className="p-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {parsing ? (
                <Loader2 size={18} className="animate-spin text-white" />
              ) : (
                <Send size={18} className="text-white" />
              )}
            </button>
          </div>
        </div>

        {!text && (
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-xs text-surface-600">Try:</span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setText(s)}
                className="text-xs px-2.5 py-1 rounded-md bg-surface-800/60 text-surface-500 hover:text-surface-300 hover:bg-surface-700/60 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}
