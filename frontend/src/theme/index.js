// Tranzor Custom Theme Configuration
// Professional financial technology theme with modern aesthetics

export const tranzorTheme = {
  token: {
    // Primary Brand Colors
    colorPrimary: '#1B4F72', // Deep blue - professional and trustworthy
    colorPrimaryBg: '#EBF3FD', // Light blue background
    colorPrimaryBgHover: '#D6E9FC', // Hover state for primary backgrounds
    colorPrimaryBorder: '#7FB3D3', // Primary border color
    colorPrimaryBorderHover: '#5DADE2', // Primary border hover
    colorPrimaryHover: '#2E86C1', // Primary hover state
    colorPrimaryActive: '#154360', // Primary active/pressed state
    colorPrimaryTextHover: '#2E86C1', // Primary text hover
    colorPrimaryText: '#1B4F72', // Primary text color
    
    // Success Colors (for approved transactions)
    colorSuccess: '#27AE60', // Green for success states
    colorSuccessBg: '#E8F8F5',
    colorSuccessBorder: '#82E0AA',
    colorSuccessHover: '#2ECC71',
    colorSuccessActive: '#1E8449',
    
    // Warning Colors (for pending transactions)
    colorWarning: '#F39C12', // Orange for warning states
    colorWarningBg: '#FEF9E7',
    colorWarningBorder: '#F7DC6F',
    colorWarningHover: '#E67E22',
    colorWarningActive: '#D68910',
    
    // Error Colors (for declined transactions and alerts)
    colorError: '#E74C3C', // Red for error states
    colorErrorBg: '#FDEDEC',
    colorErrorBorder: '#F1948A',
    colorErrorHover: '#C0392B',
    colorErrorActive: '#A93226',
    
    // Info Colors
    colorInfo: '#3498DB', // Light blue for info
    colorInfoBg: '#EBF5FB',
    colorInfoBorder: '#85C1E9',
    colorInfoHover: '#2980B9',
    colorInfoActive: '#1F618D',
    
    // Neutral Colors
    colorTextBase: '#2C3E50', // Dark blue-gray for primary text
    colorTextSecondary: '#5D6D7E', // Medium gray for secondary text
    colorTextTertiary: '#85929E', // Light gray for tertiary text
    colorTextQuaternary: '#BDC3C7', // Very light gray for disabled text
    
    // Background Colors
    colorBgBase: '#FFFFFF', // Pure white background
    colorBgContainer: '#FFFFFF', // Container background
    colorBgElevated: '#FFFFFF', // Elevated surfaces (modals, dropdowns)
    colorBgLayout: '#F8F9FA', // Layout background (slightly off-white)
    colorBgSpotlight: '#FAFBFC', // Spotlight/highlight background
    colorBgMask: 'rgba(0, 0, 0, 0.45)', // Modal mask
    
    // Border Colors
    colorBorder: '#E5E8E8', // Default border color
    colorBorderSecondary: '#F4F6F6', // Secondary border color
    
    // Typography
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontFamilyCode: '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeXL: 20,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    fontWeightStrong: 600,
    
    // Line Heights
    lineHeight: 1.5714,
    lineHeightLG: 1.5,
    lineHeightSM: 1.66,
    lineHeightHeading1: 1.2105,
    lineHeightHeading2: 1.2667,
    lineHeightHeading3: 1.3333,
    lineHeightHeading4: 1.4,
    lineHeightHeading5: 1.5,
    
    // Spacing
    padding: 16,
    paddingXS: 8,
    paddingSM: 12,
    paddingLG: 24,
    paddingXL: 32,
    
    margin: 16,
    marginXS: 8,
    marginSM: 12,
    marginLG: 24,
    marginXL: 32,
    
    // Border Radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    borderRadiusXS: 4,
    
    // Shadows
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    boxShadowSecondary: '0 4px 16px rgba(0, 0, 0, 0.08)',
    boxShadowTertiary: '0 6px 24px rgba(0, 0, 0, 0.12)',
    
    // Motion
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
    motionEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    motionEaseOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    motionEaseIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    
    // Control Heights
    controlHeight: 36,
    controlHeightSM: 28,
    controlHeightLG: 44,
    
    // Z-Index
    zIndexBase: 0,
    zIndexPopupBase: 1000,
    zIndexModal: 1000,
  },
  
  components: {
    // Layout Components
    Layout: {
      headerBg: '#FFFFFF',
      headerHeight: 64,
      headerPadding: '0 24px',
      siderBg: '#1B4F72',
      bodyBg: '#F8F9FA',
      footerBg: '#FFFFFF',
      footerPadding: '24px 50px',
      triggerBg: '#154360',
      triggerColor: '#FFFFFF',
    },
    
    // Menu
    Menu: {
      darkItemBg: '#1B4F72',
      darkItemColor: '#FFFFFF',
      darkItemHoverBg: '#2E86C1',
      darkItemSelectedBg: '#3498DB',
      darkSubMenuItemBg: '#154360',
      itemMarginBlock: 4,
      itemMarginInline: 4,
      itemPaddingInline: 16,
      itemBorderRadius: 6,
    },
    
    // Button
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      controlHeightSM: 32,
      controlHeightLG: 48,
      fontWeight: 500,
      primaryShadow: '0 2px 4px rgba(27, 79, 114, 0.2)',
    },
    
    // Card
    Card: {
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      headerBg: '#FFFFFF',
      headerHeight: 56,
      paddingLG: 24,
      actionsBg: '#FAFBFC',
    },
    
    // Table
    Table: {
      borderRadius: 8,
      headerBg: '#F8F9FA',
      headerColor: '#2C3E50',
      headerSortActiveBg: '#EBF3FD',
      headerSortHoverBg: '#F4F6F6',
      rowHoverBg: '#FAFBFC',
      rowSelectedBg: '#EBF3FD',
      rowSelectedHoverBg: '#D6E9FC',
      cellPaddingBlock: 12,
      cellPaddingInline: 16,
      headerSplitColor: '#E5E8E8',
      borderColor: '#E5E8E8',
      footerBg: '#F8F9FA',
    },
    
    // Form
    Form: {
      labelColor: '#2C3E50',
      labelFontSize: 14,
      labelHeight: 32,
      labelRequiredMarkColor: '#E74C3C',
      itemMarginBottom: 20,
    },
    
    // Input
    Input: {
      borderRadius: 8,
      controlHeight: 40,
      controlHeightSM: 32,
      controlHeightLG: 48,
      paddingInline: 12,
      paddingBlock: 8,
      fontSize: 14,
      lineHeight: 1.5714,
      colorBorder: '#D5DBDB',
      colorBorderHover: '#85C1E9',
      activeBorderColor: '#3498DB',
      activeShadow: '0 0 0 2px rgba(52, 152, 219, 0.2)',
      errorActiveShadow: '0 0 0 2px rgba(231, 76, 60, 0.2)',
      warningActiveShadow: '0 0 0 2px rgba(243, 156, 18, 0.2)',
    },
    
    // Select
    Select: {
      borderRadius: 8,
      controlHeight: 40,
      controlHeightSM: 32,
      controlHeightLG: 48,
      optionSelectedBg: '#EBF3FD',
      optionActiveBg: '#F4F6F6',
      optionPadding: '8px 12px',
    },
    
    // Modal
    Modal: {
      borderRadius: 12,
      headerBg: '#FFFFFF',
      contentBg: '#FFFFFF',
      footerBg: '#FAFBFC',
      titleColor: '#2C3E50',
      titleFontSize: 18,
      titleLineHeight: 1.4,
    },
    
    // Alert
    Alert: {
      borderRadius: 8,
      paddingContentHorizontal: 16,
      paddingContentVertical: 12,
      withDescriptionPadding: '16px 16px 16px 48px',
      withDescriptionPaddingVertical: 16,
    },
    
    // Tag
    Tag: {
      borderRadius: 6,
      paddingInline: 8,
      marginInlineEnd: 8,
      fontSizeSM: 12,
      lineHeightSM: 1.5,
    },
    
    // Badge
    Badge: {
      dotSize: 8,
      fontSize: 12,
      fontWeight: 500,
      lineHeight: 1,
      textFontSize: 12,
      textFontSizeSM: 11,
      statusSize: 8,
    },
    
    // Statistic
    Statistic: {
      titleFontSize: 14,
      contentFontSize: 24,
      contentFontWeight: 600,
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    
    // Typography
    Typography: {
      titleMarginBottom: '0.5em',
      titleMarginTop: '1.2em',
      fontFamilyCode: '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, Consolas, monospace',
    },
    
    // Tooltip
    Tooltip: {
      borderRadius: 6,
      colorBgSpotlight: 'rgba(44, 62, 80, 0.9)',
      colorTextLightSolid: '#FFFFFF',
      fontSize: 12,
      lineHeight: 1.5,
      paddingXXS: 6,
      paddingXS: 8,
    },
    
    // Spin
    Spin: {
      colorPrimary: '#3498DB',
      contentHeight: 400,
    },
    
    // Progress
    Progress: {
      defaultColor: '#3498DB',
      remainingColor: '#F4F6F6',
      circleTextColor: '#2C3E50',
      lineBorderRadius: 100,
      circleIconFontSize: 14,
    },
    
    // Pagination
    Pagination: {
      borderRadius: 6,
      itemActiveBg: '#3498DB',
      itemInputBg: '#FFFFFF',
      itemLinkBg: '#FFFFFF',
      itemSize: 32,
      itemSizeSM: 24,
      miniOptionsSizeChangerTop: 0,
    },
  },
};

// Additional custom CSS variables for advanced styling
export const customCSSVariables = {
  '--tranzor-gradient-primary': 'linear-gradient(135deg, #3498DB 0%, #1B4F72 100%)',
  '--tranzor-gradient-success': 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
  '--tranzor-gradient-warning': 'linear-gradient(135deg, #F39C12 0%, #E67E22 100%)',
  '--tranzor-gradient-error': 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)',
  '--tranzor-shadow-card': '0 4px 12px rgba(0, 0, 0, 0.08)',
  '--tranzor-shadow-elevated': '0 8px 24px rgba(0, 0, 0, 0.12)',
  '--tranzor-shadow-modal': '0 16px 48px rgba(0, 0, 0, 0.16)',
  '--tranzor-border-light': '1px solid #E5E8E8',
  '--tranzor-border-medium': '1px solid #D5DBDB',
  '--tranzor-transition-fast': 'all 0.15s cubic-bezier(0.645, 0.045, 0.355, 1)',
  '--tranzor-transition-medium': 'all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1)',
  '--tranzor-transition-slow': 'all 0.35s cubic-bezier(0.645, 0.045, 0.355, 1)',
};

export default tranzorTheme;