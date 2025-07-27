'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface BlogTagsProps {
  tags: string[];
  selectedTag?: string;
}

// タグフィルター部分のみClient Component
export function BlogTags({ tags, selectedTag }: BlogTagsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTagClick = (tag?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tag) {
      params.set('tag', tag);
    } else {
      params.delete('tag');
    }
    params.delete('page'); // タグ変更時はページを1に戻す
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="mb-8 flex flex-wrap gap-2">
      <button
        onClick={() => handleTagClick()}
        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
          !selectedTag
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            selectedTag === tag
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}