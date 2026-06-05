-- Phase 6b-1: i_replied on feed view (avoids per-post fetchUserReplyStatus on home).
-- Apply after 20260508000000_posts_with_meta.sql: supabase db push

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
  (select count(*)::int from public.bookmark b where b.post_id = p.id) as bookmark_count,
  (
    select exists (
      select 1
      from public.posts r
      where r.reply_to = p.id
        and r.type = 'reply'
        and r.user_id = auth.uid()
    )
  ) as i_replied
from public.posts p
left join public.profiles pr on pr.id = p.user_id
where p.type in ('post', 'repost');

comment on view public.posts_with_meta is 'Feed payload: post + author + counts + i_replied for auth.uid()';

grant select on public.posts_with_meta to anon, authenticated, service_role;
