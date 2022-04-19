/**
 * @file: styled.d.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

// import original module declarations
import 'styled-components/native';

export type SiteGirdItemTag =
  | 'hardware-capable'
  | 'with-pending-issue'
  | 'service';

// and extend them!
declare module 'styled-components/native' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      status: {
        info: string;
        warn: string;
        danger: string;
        success: string;
        notice: string;
      };
      severityLevel: {
        fine: string;
        defective: string;
        warning: string;
        urgent: string;
      };
      defectiveLevel: {
        fine: string;
        defective: string;
        warning: string;
        urgent: string;
      };
    };
    link: string;
    page: {
      background: string;
      card: {
        backgroundColor: string;
      };
      header: {
        titleColor: string;
        subTitleColor: string;
      };
    };
    label: {
      color: string;
      destructiveColor: string;
    };
    section: {
      background: string;
    };
    form: {
      label: {
        color: string;
      };
      input: {
        textColor: string;
        textColorFocused: string;
        textColorError: string;
        borderColor: string;
        borderColorFocused: string;
        borderColorError: string;
        backgroundColor: string;
        backgroundColorFocused: string;
        backgroundColorError: string;
        placeholderColor: string;
      };
    };
    components: {
      placeholder: {
        background: string;
      };
      card: {
        background: string;
        titleColor: string;
        headerRightColor: string;
        shadowColor: string;
        borderColor: string;
      };
      emptyView: {
        iconColor: string;
        textColor: string;
        retryButtonBgColor: string;
      };
      scrollView: {
        activityIndicator: {
          color: string;
        };
      };
      button: {
        disabledBgColor: string;
      };
      segment: {
        activeBgColor: string;
        background: string;
        textColor: string;
      };
      switch: {
        border: {
          inactive: string;
          active: string;
        };
        thumb: {
          inactive: string;
          active: string;
        };
        track: {
          inactive: {
            startColor: string;
            endColor: string;
          };
          active: {
            startColor: string;
            endColor: string;
          };
        };
      };
      table: {
        section: {
          titleColor: string;
        };
        item: {
          titleColor: string;
          subTitleColor: string;
          noteColor: string;
          detailColor: string;
          detailDisclosureIconColor: string;
          detailInfoIconColor: string;
          backgroundColor: string;
        };
        index: {
          color: string;
          activeBackgroundColor: string;
        };
        borderColor: string;
      };
      snackbar: {
        backgroundColor: string;
        textColor: string;
        closeIconColor: string;
      };
    };
    tv: {
      focusShadeColor: string;
    };
    keyboard: {
      bgColor: string;
      keyBgColor: string;
      funcKeyBgColor: string;
      keyColor: string;
      disabledKeyColor: string;
    };
    report: {
      tab: {
        bgColor: string;
        activeColor: string;
        inactiveColor: string;
      };
      construction: {
        section: {
          header: {
            titleColor: string;
          };
        };
        procedure: {
          titleColor: string;
        };
      };
    };
    order: {
      iconColor: string;
      labelColor: string;
      placeholderColor: string;
      valueColor: string;
      accessoryViewColor: string;
    };
    inspection: {
      siteGrid: {
        cellBgColor: string;
        headerBgColor: string;
        borderColor: string;
        headerTextColor: string;
        headerButtonColor: string;
        headerButtonBorderColor: string;
        siteIconColor: string;
        defaultSiteNameColor: string;
        tagColors: {
          [p in SiteGirdItemTag]: string;
        };
      };
      siteInspection: {
        itemCard: {
          bgColor: string;
          shadowColor: string;
          optionBorderColor: string;
          titleIndexColor: string;
          titleColor: string;
          mediaPlaceholderBgColor: string;
          mediaPlaceholderIconColor: string;
          unselectedOptionBgColor: string;
          unselectedOptionTextColor: string;
          maintenaceAdviceLabelColor: string;
          maintenaceAdviceTextColor: string;
          maintenaceAdviceBgColor: string;
          maintenaceAdviceBorderColor: string;
        };
        valueInput: {
          bgColor: string;
          placeholderTextColor: string;
          iconColor: string;
        };
      };
    };
  }
}
