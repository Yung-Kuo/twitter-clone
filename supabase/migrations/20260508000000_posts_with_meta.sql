-- Posts with denormalized author + counts for single-query feeds (Phase 6).
-- Apply in Supabase SQL editor or: supabase db push
-- Tune indexes on likes(post_id), bookmark(post_id), posts(reply_to, type), etc.

create or replace view public.posts_with_meta with (security_invoker = true) as
select
  p.*,
  row_to_json(pr.*) as author,
  (select count(*)::int from public.likes l where l.post_id = p.id) as like_count,
  (
    select count(*)::int
    from public.posts r
    where r.reply_to = p.id and r.type = 'reply'
  ) as reply_count,
  (
    select count(*)::int
    from public.posts rp
    where rp.reply_to = p.id and rp.type = 'repost' and rp.text = p.id::text
  ) as repost_count,
  (select count(*)::int from public.bookmark b where b.post_id = p.id) as bookmark_count
from public.posts p
left join public.profiles pr on pr.id = p.user_id
where p.type in ('post', 'repost');

comment on view public.posts_with_meta is 'Feed payload: post row + author JSON + aggregate counts';
