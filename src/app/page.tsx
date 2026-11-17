import { Suspense } from 'react';
import { connection } from 'next/server';
import { supabase } from '@/lib/supabase';
import { DailyQT } from '@/types/qt';
import MeditationNote from '@/components/MeditationNote';
import Link from 'next/link';
import {
  BookOpen,
  Music,
  Sparkles,
  MessageCircleQuestion,
  HeartHandshake,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';

export const instant = false;

function getTodayDateString() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function shiftDate(dateStr: string, days: number) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return date.toISOString().split('T')[0];
}

async function QTContent({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  await connection();
  const params = await searchParams;
  const todayStr = getTodayDateString();
  const targetDate = params.date && params.date <= todayStr ? params.date : todayStr;

  const { data: qt } = await supabase
    .from('daily_qt')
    .select('*')
    .eq('publish_date', targetDate)
    .single<DailyQT>();

  const prevDate = shiftDate(targetDate, -1);
  const nextDate = shiftDate(targetDate, 1);
  const canGoNext = nextDate <= todayStr;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold tracking-wider text-indigo-600 uppercase">
              Love Church Daily Devotional
            </span>
            <h1 className="text-lg font-extrabold text-slate-900">사랑교회 매일 말씀 묵상</h1>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <Link
              href={`/?date=${prevDate}`}
              className="p-1.5 rounded-md hover:bg-white text-slate-600 transition"
              title="이전 날"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <span className="px-2 text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              {targetDate}
            </span>
            {canGoNext ? (
              <Link
                href={`/?date=${nextDate}`}
                className="p-1.5 rounded-md hover:bg-white text-slate-600 transition"
                title="다음 날"
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="p-1.5 text-slate-300 cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        {!qt ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-sm space-y-3">
            <p className="text-slate-600 font-medium">
              선택하신 날짜({targetDate})에 등록된 묵상 본문이 없습니다.
            </p>
            {targetDate !== todayStr && (
              <Link
                href="/"
                className="inline-block text-sm font-semibold text-indigo-600 hover:underline"
              >
                오늘의 묵상으로 돌아가기 →
              </Link>
            )}
          </div>
        ) : (
          <>
            <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-6 shadow-md">
              <div className="inline-flex items-center gap-1.5 bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                <BookOpen className="w-3.5 h-3.5" />
                {qt.book} {qt.chapter_range}
              </div>
              <h2 className="text-2xl font-bold leading-snug mb-4">{qt.title}</h2>
              {qt.praise_song && (
                <div className="flex items-center gap-2 text-xs text-indigo-200 bg-black/20 rounded-xl px-3.5 py-2.5">
                  <Music className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>
                    <strong className="text-white">오늘의 찬양:</strong> {qt.praise_song}
                  </span>
                </div>
              )}
            </section>

            <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                성경 본문 <span className="text-xs font-normal text-slate-400">(개역한글)</span>
              </h3>
              <div className="space-y-2.5 text-[15px] leading-relaxed text-slate-800 whitespace-pre-line font-serif">
                {qt.scripture_text}
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                말씀 속으로
              </h3>
              <div className="text-sm leading-7 text-slate-700 whitespace-pre-line">
                {qt.commentary}
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <MessageCircleQuestion className="w-5 h-5 text-indigo-600" />
                묵상과 나눔 가이드
              </h3>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-indigo-600 mb-1">
                  Q1. 하나님은 어떤 분이신가요?
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{qt.question_god}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-emerald-600 mb-1">
                  Q2. 나에게 주시는 교훈과 적용은 무엇인가요?
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{qt.question_apply}</p>
              </div>
            </section>

            <MeditationNote
              date={qt.publish_date}
              title={`${qt.book} ${qt.chapter_range} - ${qt.title}`}
            />

            <section className="bg-indigo-50/70 rounded-2xl p-6 border border-indigo-100">
              <h3 className="text-base font-bold text-indigo-950 mb-2 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-indigo-600" />
                오늘의 기도
              </h3>
              <p className="text-sm leading-relaxed text-indigo-900 italic">
                &ldquo;{qt.prayer}&rdquo;
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default function QTPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-500">
          오늘의 묵상을 불러오는 중...
        </div>
      }