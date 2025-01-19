import { Sidebar, SidebarContent, SidebarHeader } from './SideBar';

export function AppSidebar() {
  return (
    <Sidebar className='max-h-full'>
      <SidebarHeader>WareEase</SidebarHeader>
      <SidebarContent />
    </Sidebar>
  );
}
