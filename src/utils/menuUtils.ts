import {
  IconAdjustments,
  IconCalendarStats,
  IconFileAnalytics,
  IconGauge,
  IconLock,
  IconNotes,
  IconPresentationAnalytics,
  IconHome,
  IconUsers,
  IconSettings,
  IconShield,
  IconDatabase,
  IconChartBar,
  IconShoppingCart,
  IconBuilding,
  IconReport,
  IconKey,
  IconDashboard,
  IconUser,
  IconShieldLock,
  IconKeyOff,
  IconMenu2,
  IconList,
  IconTable,
  IconForms,
  IconInputSearch,
  IconFileText,
  IconBook,
  IconHelp,
  IconInfoCircle,
  IconBookmark,
  IconFolder,
  IconFiles,
  IconArchive,
  IconClipboard,
  IconChecklist,
  IconCalculator,
  IconAbacus,
  IconChartPie,
  IconChartLine,
  IconChartArea,
  IconChartDots,
  IconChartCandle,
  IconChartRadar,
  IconChartScatter,
  IconChartBubble,
  IconChartDonut,
  IconChartSankey,
  IconChartTreemap,
  IconChartHistogram,
} from '@tabler/icons-react';
import type { MenuItem, MenuPermission } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  // Основные иконки
  'dashboard': IconDashboard,
  'home': IconHome,
  'home-2': IconHome,
  'home-2-linear': IconHome,
  'examples': IconNotes,
  'documentation': IconBook,
  'analytics': IconPresentationAnalytics,
  'contracts': IconFileAnalytics,
  'settings': IconSettings,
  'security': IconShieldLock,
  'users': IconUsers,
  'user': IconUser,
  'user-linear': IconUser,
  'reports': IconReport,
  'database': IconDatabase,
  'charts': IconChartBar,
  'orders': IconShoppingCart,
  'companies': IconBuilding,
  'role': IconShield,
  'permission': IconKey,
  'shield-keyhole': IconShieldLock,
  'shield-keyhole-outline': IconShieldLock,
  'key': IconKey,
  'key-linear': IconKey,
  'key-off': IconKeyOff,
  
  // Solar иконки
  'document-text': IconFileText,
  'document-text-linear': IconFileText,
  'crown': IconSettings,
  'crown-line': IconSettings,
  'crown-line-linear': IconSettings,
  
  // Дополнительные иконки
  'menu': IconMenu2,
  'list': IconList,
  'table': IconTable,
  'forms': IconForms,
  'input': IconInputSearch,
  'file': IconFileText,
  'text': IconFileText,
  'help': IconHelp,
  'info': IconInfoCircle,
  'bookmark': IconBookmark,
  'folder': IconFolder,
  'files': IconFiles,
  'archive': IconArchive,
  'clipboard': IconClipboard,
  'checklist': IconChecklist,
  'calculator': IconCalculator,
  'abacus': IconAbacus,
  
  // Иконки для справочников
  'dict': IconBook,
  'reference': IconBook,
  'directory': IconFolder,
  'catalog': IconList,
  'directory-linear': IconFolder,
  'catalog-linear': IconList,
  
  'default': IconNotes,
};

export function getIconByName(iconName?: string): React.ElementType {
  if (!iconName) return iconMap.default;
  
  // Убираем префиксы типа "solar:", "simple-line-icons:" и т.д.
  const cleanIconName = iconName.replace(/^[^:]+:/, '').toLowerCase();
  return iconMap[cleanIconName] || iconMap.default;
}

export function transformMenuItems(items: MenuItem[]): any[] {
  const result: any[] = [];
  
  items.forEach(item => {
    const { screen, permissions } = item;
    
    if (!screen.expanded) {
      // Если screen.expanded = false, показываем все permissions как отдельные пункты
      permissions.forEach(permission => {
        result.push({
          label: permission.description,
          icon: getIconByName(permission.icon),
          link: permission.view,
        });
      });
    } else {
      // Если screen.expanded = true, показываем как группу с вложенными пунктами
      result.push({
        label: screen.description,
        icon: getIconByName(screen.icon),
        links: permissions.map(permission => ({
          label: permission.description,
          link: permission.view,
        })),
      });
    }
  });
  
  return result;
} 