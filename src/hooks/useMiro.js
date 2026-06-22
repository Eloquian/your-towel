import { useState, useEffect, useCallback } from 'react';

export default function useMiro() {
  const [miroToken, setMiroToken] = useState(null);
  const [boardId, setBoardId] = useState(null);
  const [boardUrl, setBoardUrl] = useState(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const board = params.get('board_id');
    if (token) {
      setMiroToken(token);
      if (board && board !== 'new') setBoardId(board);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const connectMiro = useCallback(() => {
    window.location.href = '/auth';
  }, []);

  const createBoard = useCallback(async () => {
    if (!miroToken) return null;
    setConnecting(true);
    try {
      const res = await fetch('/api/miro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: miroToken, action: 'create_board' })
      });
      const data = await res.json();
      if (data.boardId) {
        setBoardId(data.boardId);
        setBoardUrl(data.boardUrl);
        return data.boardId;
      }
      return null;
    } catch {
      return null;
    } finally {
      setConnecting(false);
    }
  }, [miroToken]);

  const writeCard = useCallback(async (currentBoardId, { content, x, y }) => {
    if (!miroToken || !currentBoardId) return;
    try {
      await fetch('/api/miro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: miroToken,
          action: 'write_card',
          boardId: currentBoardId,
          data: { content, x, y }
        })
      });
    } catch {
      // silent fail
    }
  }, [miroToken]);

  const exportPortrait = useCallback(async (currentBoardId, portrait) => {
    if (!portrait) return;
    const content = `MY PORTRAIT\n\nI do my best work when:\n${portrait.bestWork || ''}\n\nWhat I won't compromise on:\n${portrait.nonNegotiables || ''}\n\nWhere I'm headed:\n${portrait.direction || ''}\n\nWhat I don't want to leave untried:\n${portrait.untried || ''}`;
    await writeCard(currentBoardId, { content, x: 0, y: 0 });
  }, [writeCard]);

  const exportOptionsMap = useCallback(async (currentBoardId, optionsMap) => {
    if (!optionsMap) return;
    const content = `OPTIONS MAP\n\n${optionsMap.summary || ''}\n\nMost interesting:\n${optionsMap.mostInteresting || ''}`;
    await writeCard(currentBoardId, { content, x: 600, y: 0 });
  }, [writeCard]);

  const exportPositions = useCallback(async (currentBoardId, selectedOptions, answers) => {
    if (!selectedOptions) return;
    const labels = ['A', 'B', 'C'];
    for (let i = 0; i < selectedOptions.length; i++) {
      const cost = answers[`${i}_cost`] || '';
      const first = answers[`${i}_first`] || '';
      const needs = answers[`${i}_needs`] || '';
      const content = `Option ${labels[i]}: ${selectedOptions[i]}\n\nWhat it asks of you:\n${cost}\n\nFirst move:\n${first}\n\nNeeds:\n${needs}`;
      await writeCard(currentBoardId, { content, x: i * 600, y: 400 });
    }
  }, [writeCard]);

  const exportActionBrief = useCallback(async (currentBoardId, brief) => {
    if (!brief) return;
    const content = `ACTION BRIEF\n\nMy first move:\n${brief.move || ''}\n\nBy:\n${brief.timeframe || ''}\n\nBecause:\n${brief.why || ''}`;
    await writeCard(currentBoardId, { content, x: 0, y: 800 });
  }, [writeCard]);

  return {
    miroToken,
    boardId,
    boardUrl,
    connecting,
    connectMiro,
    createBoard,
    exportPortrait,
    exportOptionsMap,
    exportPositions,
    exportActionBrief,
  };
}
