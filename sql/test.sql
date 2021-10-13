SELECT
	u.u_id as u_id,
	u.avatar as avatar,
	u.name as username,
	e.name as event_name,
	e.badges as badge_link
from
	u_users as u
	LEFT JOIN c_certificates as c on c.u_id = u.u_id
	LEFT JOIN e_events as e on e.e_id = c.e_id
where
	u.u_id = 4
    ;