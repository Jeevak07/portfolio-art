import { useEffect, useMemo, useState } from 'react';
import { getWorks } from '../services/api';

export function useWorks() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [activeTag, setActiveTag] = useState('All');

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    async function loadWorks() {
      try {
        setLoading(true);
        const data = await getWorks(controller.signal);
        if (!isActive) return;
        setWorks(data.items || []);
        setLoadError(false);
      } catch (error) {
        if (!isActive || controller.signal.aborted || error?.name === 'AbortError') return;
        try {
          await new Promise((resolve) => setTimeout(resolve, 800));
          const retryData = await getWorks(controller.signal);
          if (!isActive) return;
          setWorks(retryData.items || []);
          setLoadError(false);
        } catch (retryError) {
          if (!isActive || controller.signal.aborted || retryError?.name === 'AbortError') return;
          setWorks([]);
          setLoadError(true);
        }
      } finally {
        if (isActive) setLoading(false);
      }
    }

    loadWorks();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  const tags = useMemo(() => {
    const unique = new Set(['All']);
    works.forEach((work) => unique.add(work.tag || 'Sketch'));
    return Array.from(unique);
  }, [works]);

  const filteredWorks = useMemo(() => {
    if (activeTag === 'All') return works;
    return works.filter((work) => work.tag === activeTag);
  }, [activeTag, works]);

  return {
    works,
    setWorks,
    loading,
    loadError,
    activeTag,
    setActiveTag,
    tags,
    filteredWorks,
  };
}
