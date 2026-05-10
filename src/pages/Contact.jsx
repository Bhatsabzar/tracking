import SectionTitle from '../components/SectionTitle';
import GlassButton from '../components/GlassButton';

export default function Contact() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <SectionTitle
        eyebrow="Contact"
        title="Plan with our team"
        subtitle="Srinagar-based coordinators respond within one business day."
      />
      <div className="glass-panel rounded-2xl p-8 space-y-4">
        <p className="text-slate-700 dark:text-slate-200">
          Email: <a className="text-glacier-600 dark:text-glacier-400" href="mailto:hello@kashmirtracker.example">hello@kashmirtracker.example</a>
        </p>
        <p className="text-slate-700 dark:text-slate-200">Phone: +91 194 000 0000</p>
        <GlassButton type="button" variant="primary" onClick={() => window.alert('Thanks — this is a demo CTA.')}>
          Request a callback
        </GlassButton>
      </div>
    </div>
  );
}
