import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rbac }                     from "../api";
import { setPermissions }            from "../store/permissionsSlice";
import { selectMenuItems, selectPermLoaded } from "../store/permissionsSlice";
import { selectUser }                from "../store/authSlice";

export function usePermissions() {
  const dispatch  = useDispatch();
  const user      = useSelector(selectUser);
  const items     = useSelector(selectMenuItems);
  const loaded    = useSelector(selectPermLoaded);

  useEffect(() => {
    if (user && !loaded) {
      rbac.myPermissions()
        .then((res) => dispatch(setPermissions(res.data.data)))
        .catch(() => {});
    }
  }, [user, loaded, dispatch]);

  const can = (key, action = "can_view") => {
    if (!user) return false;
    if (user.role === "superuser") return true;
    const item = items.find((i) => i.key === key);
    return item ? !!item[action] : false;
  };

  return { menuItems: items, can, loaded };
}