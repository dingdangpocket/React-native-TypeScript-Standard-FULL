/**
 * @file: dark.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { Colors, StatusColors } from '@euler/components';
import { DefaultTheme } from 'styled-components/native';

const theme: DefaultTheme = {
  colors: {
    primary: '#009FD4',
    secondary: '#7B4BF6',
    status: {
      info: StatusColors.Info,
      warn: StatusColors.Warn,
      danger: StatusColors.Danger,
      success: StatusColors.Success,
      notice: StatusColors.Notice,
    },
    severityLevel: {
      fine: StatusColors.Success,
      defective: StatusColors.Notice,
      warning: StatusColors.Warn,
      urgent: StatusColors.Danger,
    },
    defectiveLevel: {
      fine: StatusColors.Success,
      defective: StatusColors.Notice,
      warning: StatusColors.Warn,
      urgent: StatusColors.Danger,
    },
  },
  page: {
    background: '#eee',
    card: {
      backgroundColor: '#eee',
    },
    header: {
      titleColor: '#000',
      subTitleColor: '#444',
    },
  },
  label: {
    color: '#000',
    destructiveColor: StatusColors.Danger,
  },
  section: {
    background: Colors.White,
  },
  link: '#2669db',
  form: {
    label: { color: '#444' },
    input: {
      borderColor: '#888',
      borderColorFocused: '#2669db',
      borderColorError: StatusColors.Danger,
      backgroundColor: '#fff',
      backgroundColorFocused: '#fff',
      backgroundColorError: '#fff1f0',
      placeholderColor: '#ccc',
      textColor: '#000',
      textColorFocused: '#000',
      textColorError: StatusColors.Danger,
    },
  },
  components: {
    placeholder: {
      background: Colors.Gray10,
    },
    card: {
      background: Colors.White,
      titleColor: Colors.Black,
      headerRightColor: Colors.Gray4,
      shadowColor: '#cccccc',
      borderColor: '#eee',
    },
    emptyView: {
      iconColor: Colors.Gray4,
      textColor: Colors.Gray4,
      retryButtonBgColor: Colors.Gray4,
    },
    scrollView: {
      activityIndicator: {
        color: Colors.Gray3,
      },
    },
    button: {
      disabledBgColor: Colors.Gray4,
    },
    segment: {
      textColor: Colors.Gray2,
      background: '#e8e8e8',
      activeBgColor: '#ffffff',
    },
    switch: {
      border: {
        inactive: '#BFBFBF',
        active: Colors.Purple1,
      },
      thumb: {
        inactive: '#ffffff',
        active: '#ffffff',
      },
      track: {
        inactive: {
          startColor: '#f5f5f5',
          endColor: '#f5f5f5',
        },
        active: {
          startColor: Colors.Purple1,
          endColor: Colors.ThroughPurple,
        },
      },
    },
    table: {
      section: {
        titleColor: Colors.Black,
      },
      item: {
        titleColor: Colors.Black,
        subTitleColor: Colors.Gray3,
        noteColor: Colors.Gray2,
        detailColor: Colors.Gray4,
        detailDisclosureIconColor: Colors.Gray4,
        detailInfoIconColor: StatusColors.Info,
        backgroundColor: Colors.White,
      },
      index: {
        color: '#666666',
        activeBackgroundColor: '#c4c4c4',
      },
      borderColor: Colors.Gray4,
    },
    snackbar: {
      backgroundColor: '#ff',
      textColor: '#333',
      closeIconColor: '#666',
    },
  },
  tv: {
    focusShadeColor: 'rgba(162, 135, 244, 0.25)',
  },
  keyboard: {
    bgColor: '#323232',
    keyBgColor: '#6F6F6F',
    funcKeyBgColor: '#4B4B4B',
    keyColor: '#FFFFFF',
    disabledKeyColor: '#858585',
  },
  report: {
    tab: {
      bgColor: '#e1e1e1',
      activeColor: StatusColors.Info,
      inactiveColor: Colors.Gray1,
    },
    construction: {
      section: {
        header: {
          titleColor: '#758ebe',
        },
      },
      procedure: {
        titleColor: '#333',
      },
    },
  },
  order: {
    iconColor: '#207FE7',
    labelColor: '#777',
    placeholderColor: '#CCCCCC',
    valueColor: '#333333',
    accessoryViewColor: '#999999',
  },
  inspection: {
    siteGrid: {
      cellBgColor: '#ffffff',
      headerBgColor: '#ffffff',
      borderColor: '#F3F3F3',
      headerTextColor: '#333333',
      headerButtonColor: 'transparent',
      headerButtonBorderColor: '#F3F3F3',
      siteIconColor: '#444',
      defaultSiteNameColor: '#333333',
      tagColors: {
        'hardware-capable': '#207FE7',
        'with-pending-issue': '#DA9544',
        service: '#207FE7',
      },
    },
    siteInspection: {
      itemCard: {
        bgColor: '#fff',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        optionBorderColor: '#f2f2f2',
        titleIndexColor: '#000',
        titleColor: '#000',
        mediaPlaceholderBgColor: '#f1f1f1',
        mediaPlaceholderIconColor: '#666',
        unselectedOptionTextColor: '#555',
        unselectedOptionBgColor: '#fff',
        maintenaceAdviceLabelColor: '#333',
        maintenaceAdviceTextColor: '#207FE7',
        maintenaceAdviceBorderColor: '#207FE7',
        maintenaceAdviceBgColor: '#fff',
      },
      valueInput: {
        bgColor: '#f5f5f5',
        placeholderTextColor: '#ccc',
        iconColor: '#999',
      },
    },
  },
};

export default theme;
