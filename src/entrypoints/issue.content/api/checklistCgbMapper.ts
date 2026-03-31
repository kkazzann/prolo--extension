import type { ChecklistApiResponse, ChecklistStatus, ChecklistTableData, ChecklistTableRow } from '../lib/types';
import { createCgbColumns, createRow, normalizeTitle, parseCheckpointDescription } from './checklistShared';

export const mapCgbChecklistsToTableData = (apiResponse: ChecklistApiResponse): ChecklistTableData => {
  const rowsByShop = new Map<string, ChecklistTableRow>();
  const includedChecklists = (apiResponse.checklists ?? [])
    .filter(checklist => {
      const checklistTitle = normalizeTitle(checklist.title);
      return !checklistTitle.startsWith('banners checked');
    })
    .sort((left, right) => {
      const leftOrder = Number(left.ordering);
      const rightOrder = Number(right.ordering);
      const safeLeft = Number.isFinite(leftOrder) ? leftOrder : Number.MAX_SAFE_INTEGER;
      const safeRight = Number.isFinite(rightOrder) ? rightOrder : Number.MAX_SAFE_INTEGER;
      if (safeLeft !== safeRight) {
        return safeLeft - safeRight;
      }
      return left.title.localeCompare(right.title);
    });

  const dynamicColumns = includedChecklists
    .map(checklist => ({ id: `cgb:${checklist.id}`, label: checklist.title.trim() }))
    .filter(column => !!column.label);

  const columnIdByChecklistId = new Map<string, string>();
  for (const column of dynamicColumns) {
    const checklistId = column.id.replace('cgb:', '');
    columnIdByChecklistId.set(checklistId, column.id);
  }

  const getRow = (shop: string, order: number) => {
    const existing = rowsByShop.get(shop);
    if (existing) {
      existing.order = Math.min(existing.order, order);
      return existing;
    }

    const row = createRow(shop, order);
    rowsByShop.set(shop, row);
    return row;
  };

  for (const checklist of includedChecklists) {
    const checklistColumnId = columnIdByChecklistId.get(checklist.id);
    if (!checklistColumnId) {
      continue;
    }

    for (const checkpoint of checklist.checkpoints ?? []) {
      const doneValue = checkpoint.done === '1' ? 1 : 0;
      const orderValue = Number(checkpoint.ordering);
      const order = Number.isFinite(orderValue) ? orderValue : Number.MAX_SAFE_INTEGER;

      const parsed = parseCheckpointDescription(checkpoint.description || '');
      if (!parsed) {
        continue;
      }

      for (const shopCode of parsed.shopCodes) {
        const row = getRow(shopCode, order);
        if (!row.cgbStatuses) {
          row.cgbStatuses = {};
        }
        if (!row.cgbCheckpointRefs) {
          row.cgbCheckpointRefs = {};
        }
        row.cgbStatuses[checklistColumnId] = doneValue as ChecklistStatus;
        row.cgbCheckpointRefs[checklistColumnId] = { checklistId: checklist.id, checkpointId: checkpoint.id };
        row.columnStatuses[checklistColumnId] = doneValue as ChecklistStatus;
        row.columnCheckpointRefs[checklistColumnId] = { checklistId: checklist.id, checkpointId: checkpoint.id };
      }
    }
  }

  const rows = Array.from(rowsByShop.values()).sort((left, right) => {
    if (left.order !== right.order) {
      return left.order - right.order;
    }

    return left.shop.localeCompare(right.shop);
  });

  const columns = createCgbColumns(dynamicColumns);
  return { headers: columns.map(column => column.label), columns, rows, hasGroupedNslt: false };
};
