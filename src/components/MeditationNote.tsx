'use client';

import { useState, useEffect } from 'react';
import { PenLine, Check, Copy } from 'lucide-react';

interface Props {
  date: string;
  title: string;
}

export default function MeditationNote({ date, title }: Props) {
  const storageKey = `qt-note-${date}`;
  const [verseNote, setVerseNote] = useState('');
  const [actionNote, setActionNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setVerseNote(parsed.verseNote || '');
      setActionNote(parsed.actionNote || '');
    } else {
      setVerseNote('');
      setActionNote('');
    }
  }, [storageKey]);

  const handleSave = () => {
    localStorage.setItem(storageKey, JSON.stringify({ verseNote, actionNote }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopy = () => {
    const shareText = `[사랑교회 매일묵상 나눔 - ${date}]\n📖 ${title}\n\n📌 마음에 남는 구절 & 깨달음:\n${verseNote || '(기록 없음)'}\n\n🌱 오늘 나의 순종 결단:\n${actionNote || '(기록 없음)'}`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <PenLine className="w-5 h-5 text-amber-700" />
        <h2 className="text-lg font-bold text-slate-800">나의 묵상 기록 & 결단</h2>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        작성하신 내용은 현재 기기(브라우저)에 저장되며, 복사하여 소그룹 단톡방에 바로 나누실 수 있습니다.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            📌 마음에 남는 한 구절 & 깨달음
          </label>
          <textarea
            rows={3}
            value={verseNote}
            onChange={(e) => setVerseNote(e.target.value)}
            placeholder="오늘 본문 중 가장 마음에 와닿은 구절과 주신 마음을 적어보세요."
            className="w-full rounded-xl border border-amber-200 bg-white p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            🌱 오늘 나의 구체적 순종 결단
          </label>
          <textarea
            rows={2}
            value={actionNote}
            onChange={(e) => setActionNote(e.target.value)}
            placeholder="가정과 일터에서 오늘 바로 실천할 한 가지 순종을 적어보세요."
            className="w-full rounded-xl border border-amber-200 bg-white p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition cursor-pointer"
          >
            {saved ? <Check className="w-4 h-4" /> : null}
            {saved ? '저장 완료!' : '내 기기에 저장'}
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium py-2.5 px-4 rounded-xl text-sm transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? '복사됨' : '나눔용 복사'}
          </button>
        </div>
      </div>
    </section>
  );
}