/** 그룹 — 피드/활동의 소속 단위. groupId=null 은 "개인". */
export interface Group {
  id: number | null;
  name: string;
}

/** 피드 필터의 그룹 후보(개인 + 데모 그룹들). 실제로는 group-service 가 내려준다. */
export const PERSONAL_GROUP: Group = { id: null, name: '개인' };
