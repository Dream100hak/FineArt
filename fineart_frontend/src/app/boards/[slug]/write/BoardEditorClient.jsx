'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { createArticle, updateArticle } from '@/lib/api';
import useDecodedAuth from '@/hooks/useDecodedAuth';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const CATEGORY_OPTIONS = [
  { value: '', label: '카테고리 선택' },
  { value: 'notice', label: '공지' },
  { value: 'news', label: '뉴스' },
  { value: 'event', label: '전시/행사' },
  { value: 'recruit', label: '채용' },
  { value: 'community', label: '커뮤니티' },
];

const defaultForm = {
  title: '',
  writer: '',
  email: '',
  category: '',
  content: '',
};

export default function BoardEditorClient({ board, initialArticle }) {
  const router = useRouter();
  const { isAuthenticated, decodedEmail, decodedRole } = useDecodedAuth();
  const isAdmin = decodedRole === 'admin';

  const [form, setForm] = useState({
    title: initialArticle?.title ?? defaultForm.title,
    writer: initialArticle?.writer ?? defaultForm.writer,
    email: initialArticle?.email ?? decodedEmail ?? defaultForm.email,
    category: initialArticle?.category ?? defaultForm.category,
    content: initialArticle?.content ?? defaultForm.content,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!initialArticle?.writer && decodedEmail) {
      setForm((prev) => ({
        ...prev,
        writer: prev.writer || decodedEmail.split('@')[0],
        email: prev.email || decodedEmail,
      }));
    }
  }, [decodedEmail, initialArticle?.writer]);

  const isEditing = Boolean(initialArticle?.id);
  const editorReadOnly = board?.isFallback;

  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'blockquote'],
        ['clean'],
      ],
    }),
    [],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (editorReadOnly) {
      setError('게시판 정보를 불러오지 못해 글쓰기를 진행할 수 없습니다.');
      return;
    }

    if (!form.title.trim() || !form.content.trim()) {
      setError('제목과 본문을 입력해 주세요.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        boardTypeId: board.id,
        title: form.title.trim(),
        content: form.content,
        writer: form.writer.trim() || 'FineArt 사용자',
        email: form.email.trim() || decodedEmail || 'user@fineart.local',
        category: form.category || undefined,
        imageUrl: initialArticle?.imageUrl ?? null,
        thumbnailUrl: initialArticle?.thumbnailUrl ?? null,
      };

      if (isEditing) {
        await updateArticle(initialArticle.id, payload);
      } else {
        await createArticle(payload);
      }

      setSuccess(isEditing ? '게시글이 수정되었습니다.' : '게시글이 등록되었습니다.');
      router.push(`/boards/${board.slug}`);
    } catch (err) {
      console.error('[Board] Failed to submit article:', err);
      setError(err?.response?.data?.message ?? '게시글 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="screen-padding section mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-neutral-900">로그인이 필요합니다.</p>
        <p className="text-sm text-neutral-600">FineArt 계정으로 로그인하면 글을 작성할 수 있습니다.</p>
        <div className="flex gap-3">
          <Link href={`/boards/${board?.slug ?? ''}`} className="rounded-full border border-neutral-300 px-5 py-2 text-sm text-neutral-600">
            게시판으로
          </Link>
          <Link href="/login" className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white">
            로그인
          </Link>
        </div>
      </div>
    );
  }

  if (editorReadOnly) {
    return (
      <div className="screen-padding section mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-neutral-900">게시판 정보를 불러오는 중입니다.</p>
        <p className="text-sm text-neutral-600">
          현재 게시판 메타데이터를 확인할 수 없어 글쓰기를 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.
        </p>
        <Link href={`/boards/${board?.slug ?? ''}`} className="rounded-full border border-neutral-300 px-5 py-2 text-sm text-neutral-600">
          게시판으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="screen-padding section mx-auto w-full max-w-4xl space-y-6 py-10">
      <div className="flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">{board.slug}</p>
            <h1 className="text-3xl font-semibold text-neutral-900">
              {isEditing ? '게시글 수정' : '새 게시글 작성'}
            </h1>
            <p className="text-sm text-neutral-600">{board.name} · {board.description}</p>
          </div>
          <Link
            href={`/boards/${board.slug}`}
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-600 transition hover:border-neutral-900 hover:text-neutral-900"
          >
            게시판으로
          </Link>
        </div>
        {(!isAdmin && isEditing) && (
          <p className="rounded-2xl bg-amber-50 px-4 py-2 text-xs text-amber-800">
            게시글 수정은 관리자 권한이 필요할 수 있습니다.
          </p>
        )}
        {error && (
          <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-2 text-xs text-red-700">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs text-emerald-700">
            {success}
          </p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-sm"
      >
        <label className="block text-sm font-medium text-neutral-700">
          제목
          <input
            type="text"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-2 text-base focus:border-neutral-900 focus:outline-none"
            placeholder="게시글 제목을 입력하세요."
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-neutral-700">
            작성자
            <input
              type="text"
              value={form.writer}
              onChange={(event) => setForm((prev) => ({ ...prev, writer: event.target.value }))}
              className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-2 focus:border-neutral-900 focus:outline-none"
              placeholder="닉네임 또는 이름"
            />
          </label>
          <label className="text-sm font-medium text-neutral-700">
            연락 이메일
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-2 focus:border-neutral-900 focus:outline-none"
              placeholder="contact@example.com"
            />
          </label>
        </div>

        <label className="text-sm font-medium text-neutral-700">
          카테고리
          <select
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
            className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-2 focus:border-neutral-900 focus:outline-none"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value || 'placeholder'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">본문</label>
          <ReactQuill
            theme="snow"
            value={form.content}
            onChange={(value) => setForm((prev) => ({ ...prev, content: value }))}
            modules={quillModules}
            className="min-h-[320px] rounded-2xl bg-white"
          />
          <p className="text-xs text-neutral-500">
            이미지, 링크, 서식을 자유롭게 사용하세요. 저장 시 HTML 형태로 백엔드에 전달됩니다.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/boards/${board.slug}`}
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-600"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-neutral-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
          >
            {saving ? '저장 중...' : isEditing ? '게시글 수정' : '게시글 등록'}
          </button>
        </div>
      </form>
    </div>
  );
}
