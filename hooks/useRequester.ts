import { useEffect, useState } from "react";
import { Request, requester, RequestOptions } from "../api/common";

export function useRequester<T>({
  request,
  options,
}: {
  request: Request;
  options?: RequestOptions;
}) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const loadData = async () => {
    const res = await requester(request, options);
    setData(res.data);
    setLoading(false);
  };
  useEffect(() => {
    loadData();
  }, []);

  return { data, loading, reload: loadData };
}
