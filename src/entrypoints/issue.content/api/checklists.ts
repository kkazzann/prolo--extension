import axios from 'axios';
import type { ChecklistApiResponse, ChecklistMode, ChecklistTableData, SpreadsheetTranslations } from '../lib/types';
import { getIssueModePlugin } from './issueModePlugins';

export const createEmptyTableData = (mode: ChecklistMode): ChecklistTableData =>
  getIssueModePlugin(mode).createEmptyTableData();

export const mapChecklistsToTableData = (
  apiResponse: ChecklistApiResponse,
  mode: ChecklistMode,
  spreadsheet?: SpreadsheetTranslations | null,
): ChecklistTableData => {
  return getIssueModePlugin(mode).mapTableData(apiResponse, spreadsheet);
};

export const fetchChecklists = async (issueId: number) => {
  const baseUrl = window.location.origin;
  const apiUrl = `${baseUrl}/api/issueLog/checklist/?issue_id=${issueId}`;

  try {
    const { data } = await axios.get(apiUrl);
    return data as ChecklistApiResponse;
  } catch (error) {
    console.error('Failed to fetch checklists:', error);
    throw error;
  }
};
