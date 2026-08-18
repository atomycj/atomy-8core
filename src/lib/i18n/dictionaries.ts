import type { Locale } from "./locale";

export interface Dictionary {
  appName: string;
  nav: {
    dashboard: string;
    today: string;
    history: string;
    groups: string;
    guide: string;
    admin: string;
    signOut: string;
  };
  common: {
    prev: string;
    next: string;
    save: string;
    saving: string;
    saved: string;
    notWritten: string;
    today: string;
  };
  login: {
    subtitle: string;
    googleButton: string;
    googleButtonLoading: string;
  };
  dashboard: {
    title: string;
    viewTabs: { day: string; week: string; month: string };
    day: {
      progressLabel: string;
      editButton: string;
      createButton: string;
    };
    week: {
      activeDays: string;
      completeDays: string;
      totalItems: string;
      dailyTotal: string;
    };
    month: {
      activeDays: string;
      completeDays: string;
      avgProgress: string;
      itemStatsTitle: string;
    };
  };
  history: {
    title: string;
    weekdayLabels: string[];
    footerNote: string;
  };
  groups: {
    title: string;
    subtitle: string;
    myGroupsTitle: string;
    ownerBadge: string;
    emptyGroups: string;
    forms: {
      joinTab: string;
      createTab: string;
      joinHelp: string;
      selectPlaceholder: string;
      noGroups: string;
      passwordPlaceholder: string;
      joinSubmit: string;
      joinSubmitting: string;
      createHelp: string;
      namePlaceholder: string;
      createPasswordPlaceholder: string;
      createSubmit: string;
      createSubmitting: string;
    };
    detail: {
      backLink: string;
      me: string;
      noRecord: string;
      memberColumn: string;
      activeDays: string;
      completeDays: string;
      avgProgress: string;
    };
  };
  admin: {
    title: string;
    subtitle: string;
    userColumn: string;
    permissionColumn: string;
    adminBadge: string;
    permissionLabel: string;
    noName: string;
    empty: string;
  };
  profile: {
    title: string;
    changePhoto: string;
    photoHint: string;
    nameLabel: string;
    namePlaceholder: string;
    savedMessage: string;
    errorInvalidType: string;
    errorTooLarge: string;
    errorGeneric: string;
  };
  record: {
    shareButton: string;
    copied: string;
    textareaPlaceholder: string;
  };
}

const dictionaries: Record<Locale, Dictionary> = {
  ko: {
    appName: "애터미 8코어",
    nav: {
      dashboard: "대시보드",
      today: "오늘 기록",
      history: "히스토리",
      groups: "그룹",
      guide: "가이드",
      admin: "관리자",
      signOut: "로그아웃",
    },
    common: {
      prev: "이전",
      next: "다음",
      save: "저장하기",
      saving: "저장 중...",
      saved: "저장됨",
      notWritten: "(미작성)",
      today: "오늘",
    },
    login: {
      subtitle: "매일의 8가지 성공습관을 기록하고 팀과 공유하세요",
      googleButton: "Google로 로그인",
      googleButtonLoading: "로그인 중...",
    },
    dashboard: {
      title: "내 대시보드",
      viewTabs: { day: "일간", week: "주간", month: "월간" },
      day: {
        progressLabel: "이 날의 진행률",
        editButton: "기록 수정",
        createButton: "기록 작성",
      },
      week: {
        activeDays: "실천일",
        completeDays: "완주일",
        totalItems: "주간 작성 항목",
        dailyTotal: "일별 합계",
      },
      month: {
        activeDays: "실천일",
        completeDays: "완주일",
        avgProgress: "평균 진행률",
        itemStatsTitle: "항목별 실천 현황 (이번 달)",
      },
    },
    history: {
      title: "히스토리",
      weekdayLabels: ["일", "월", "화", "수", "목", "금", "토"],
      footerNote: "날짜를 클릭하면 해당 날짜의 기록을 조회하거나 수정할 수 있어요.",
    },
    groups: {
      title: "그룹",
      subtitle: "그룹에 참여하면 팀원들의 8코어 기록을 함께 볼 수 있어요.",
      myGroupsTitle: "내 그룹",
      ownerBadge: "개설자",
      emptyGroups: "아직 참여한 그룹이 없어요. 위에서 그룹에 참여하거나 만들어보세요.",
      forms: {
        joinTab: "그룹 참여",
        createTab: "그룹 만들기",
        joinHelp: "그룹을 선택하고 비밀번호를 입력해서 참여하세요.",
        selectPlaceholder: "그룹 선택",
        noGroups: "아직 생성된 그룹이 없어요.",
        passwordPlaceholder: "그룹 비밀번호",
        joinSubmit: "참여하기",
        joinSubmitting: "참여 중...",
        createHelp: "새 그룹을 만들고 팀원에게 비밀번호를 공유하세요.",
        namePlaceholder: "그룹 이름",
        createPasswordPlaceholder: "그룹 비밀번호 (4자 이상)",
        createSubmit: "그룹 만들기",
        createSubmitting: "생성 중...",
      },
      detail: {
        backLink: "← 그룹 목록",
        me: "나",
        noRecord: "이 날짜에 작성된 기록이 없어요.",
        memberColumn: "멤버",
        activeDays: "실천일",
        completeDays: "완주일",
        avgProgress: "평균 진행률",
      },
    },
    admin: {
      title: "관리자",
      subtitle: "그룹을 만들 수 있는 사용자를 지정할 수 있습니다.",
      userColumn: "사용자",
      permissionColumn: "권한",
      adminBadge: "관리자",
      permissionLabel: "그룹 생성 권한",
      noName: "(이름 없음)",
      empty: "아직 가입한 사용자가 없습니다.",
    },
    profile: {
      title: "내 프로필",
      changePhoto: "사진 변경",
      photoHint: "JPG/PNG/WEBP/GIF, 2MB 이하",
      nameLabel: "표시 이름",
      namePlaceholder: "다른 사람에게 보여질 이름",
      savedMessage: "저장했어요.",
      errorInvalidType:
        "JPG, PNG, WEBP, GIF 이미지만 업로드할 수 있어요. (HEIC 등은 지원하지 않아요)",
      errorTooLarge: "이미지 용량은 2MB 이하여야 해요.",
      errorGeneric: "저장에 실패했습니다.",
    },
    record: {
      shareButton: "팀에 공유하기",
      copied: "복사됨! ✓",
      textareaPlaceholder: "오늘의 실천 내용을 입력하세요",
    },
  },
  en: {
    appName: "Atomy 8 Core",
    nav: {
      dashboard: "Dashboard",
      today: "Today",
      history: "History",
      groups: "Groups",
      guide: "Guide",
      admin: "Admin",
      signOut: "Sign out",
    },
    common: {
      prev: "Previous",
      next: "Next",
      save: "Save",
      saving: "Saving...",
      saved: "Saved",
      notWritten: "(Not written)",
      today: "Today",
    },
    login: {
      subtitle: "Track your daily 8 Core habits and share them with your team",
      googleButton: "Sign in with Google",
      googleButtonLoading: "Signing in...",
    },
    dashboard: {
      title: "My Dashboard",
      viewTabs: { day: "Day", week: "Week", month: "Month" },
      day: {
        progressLabel: "Progress for this day",
        editButton: "Edit record",
        createButton: "Add record",
      },
      week: {
        activeDays: "Active days",
        completeDays: "Complete days",
        totalItems: "Items this week",
        dailyTotal: "Daily total",
      },
      month: {
        activeDays: "Active days",
        completeDays: "Complete days",
        avgProgress: "Avg. progress",
        itemStatsTitle: "This month by item",
      },
    },
    history: {
      title: "History",
      weekdayLabels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      footerNote: "Click a date to view or edit that day's record.",
    },
    groups: {
      title: "Groups",
      subtitle: "Join a group to see your teammates' 8 Core records.",
      myGroupsTitle: "My Groups",
      ownerBadge: "Owner",
      emptyGroups: "You haven't joined any groups yet. Join or create one above.",
      forms: {
        joinTab: "Join group",
        createTab: "Create group",
        joinHelp: "Pick a group and enter its password to join.",
        selectPlaceholder: "Select a group",
        noGroups: "No groups have been created yet.",
        passwordPlaceholder: "Group password",
        joinSubmit: "Join",
        joinSubmitting: "Joining...",
        createHelp: "Create a new group and share the password with your team.",
        namePlaceholder: "Group name",
        createPasswordPlaceholder: "Group password (min. 4 characters)",
        createSubmit: "Create group",
        createSubmitting: "Creating...",
      },
      detail: {
        backLink: "← Group list",
        me: "Me",
        noRecord: "No record for this date.",
        memberColumn: "Member",
        activeDays: "Active days",
        completeDays: "Complete days",
        avgProgress: "Avg. progress",
      },
    },
    admin: {
      title: "Admin",
      subtitle: "Choose which users are allowed to create groups.",
      userColumn: "User",
      permissionColumn: "Permission",
      adminBadge: "Admin",
      permissionLabel: "Can create groups",
      noName: "(No name)",
      empty: "No users have signed up yet.",
    },
    profile: {
      title: "My Profile",
      changePhoto: "Change photo",
      photoHint: "JPG/PNG/WEBP/GIF, up to 2MB",
      nameLabel: "Display name",
      namePlaceholder: "Name shown to others",
      savedMessage: "Saved.",
      errorInvalidType:
        "Only JPG, PNG, WEBP, or GIF images are supported. (HEIC etc. are not supported)",
      errorTooLarge: "Images must be 2MB or smaller.",
      errorGeneric: "Failed to save.",
    },
    record: {
      shareButton: "Share with team",
      copied: "Copied! ✓",
      textareaPlaceholder: "Write what you did today",
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
