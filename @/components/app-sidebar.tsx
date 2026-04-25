'use client'

import * as React from 'react'

import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar'
import {
  TerminalSquareIcon,
  BotIcon,
  HomeIcon,
  Building2,
  LucideLayoutDashboard,
  BookOpenIcon,
  Settings2Icon,
  FrameIcon,
  PieChartIcon,
  MapIcon,
  EggIcon,
  CastleIcon,
  Laptop2Icon,
  LaptopIcon,
  SmilePlusIcon,
  SparkleIcon,
  SparklesIcon,
  WorkflowIcon,
  SquareActivity,
  LayoutDashboard,
  SquareDashedBottom,
  GalleryVerticalEndIcon,
  AudioLinesIcon,
  TerminalIcon,
  Trash2,
  MoreHorizontalIcon,
  Book,
  SearchIcon,
  BookIcon
} from 'lucide-react'
import { navigate } from 'wouter/use-browser-location'
import { useHome } from '@renderer/ui/HyperHome/useHome'
import { NavLink } from 'react-router-dom'

export function AppSidebar({
  name = '',
  ...props
}: React.ComponentProps<typeof Sidebar> & { name?: string }) {
  //

  React.useEffect(() => {
    //
    useHome.setState({
      workspace: name || ''
    })
    //
  }, [name])

  let [workspaces, setWorkspaces] = React.useState([])
  let [mainMenu, setMainMenu] = React.useState([])
  let [subMenu, setSubMenu] = React.useState([])

  React.useEffect(() => {
    let reload = () => {
      const controller = window.api.askAI(
        {
          route: 'listWorkspaces'
        },
        (stream) => {
          //
          const resp = JSON.parse(stream)
          console.log(resp)
        }
      )

      controller.getDataAsync().then((data) => {
        //

        //
        setWorkspaces(
          data.workspaces.map((item) => {
            let icon = <LucideLayoutDashboard />
            if (item.name.toLowerCase() === 'personal') {
              icon = <HomeIcon></HomeIcon>
            }
            if (item.name.toLowerCase() === 'work') {
              icon = <Building2></Building2>
            }
            return {
              active: item.name === name,
              name: item.name,
              logo: icon,
              plan: `Workspace`
            }
          })
        )

        //

        useHome.setState({
          workspace: name
        })

        useHome
          .getState()
          .loadFolderConfig({})
          .then((folder) => {
            //
            // console.log('folder', folder)

            //
            //
            if (folder) {
              setMainMenu([
                // {
                //   title: 'AI Tool',
                //   url: '#',
                //   icon: <Book />,
                //   isActive: true,
                //   //
                //   items: [
                //     {
                //       title: 'Analyse Files',
                //       url: `/workspace/${name}/study-files`
                //     }
                //   ]
                // },

                {
                  title: 'Workspace Settings',
                  url: '#',
                  icon: <TerminalSquareIcon />,
                  isActive: true,
                  items: [
                    // {
                    //   title: 'Dashboard',
                    //   url: `/workspace/${name}/files`
                    // },

                    {
                      title: 'Folder Location',
                      url: `/workspace/${name}/settings`
                    },

                    {
                      title: 'Remove Workspace',
                      url: `/workspace/${name}/advanced-settings`
                    }
                  ]
                }
              ])

              setSubMenu([
                {
                  name: 'AI Study Files',
                  url: `/workspace/${name}/study-files`,
                  icon: <BookIcon />
                },
                {
                  name: 'Serach Engine Status',
                  url: `/workspace/${name}/index`,
                  icon: <SearchIcon />
                },
                {
                  name: 'LMStudio',
                  url: `/workspace/${name}/setup`,
                  icon: <BotIcon />
                }
              ])
            } else {
              //
              setSubMenu([
                // {
                //   name: 'LMStudio AI',
                //   url: `/workspace/${name}/setup`,
                //   icon: <BotIcon />
                // }
              ])

              //

              setMainMenu([
                {
                  title: 'AI Workspace',
                  url: '#',
                  icon: <TerminalSquareIcon />,
                  isActive: true,
                  //
                  items: [
                    {
                      title: 'Workspace Setup',
                      url: `/workspace/${name}/settings`
                    }

                    // {
                    //   title: 'CLI Builder',
                    //   url: `/workspace/${name}/cli-builder`
                    // }
                  ]
                }
              ])
            }
            //
          })

        //
      })
    }

    //

    reload()

    //

    window.addEventListener('refresh-watcher', reload)
    window.addEventListener('reload-workspaces', reload)

    let timer = setInterval(() => {
      //

      const controller = window.api.askAI(
        {
          route: 'checkWorkspace',
          folderName: name
        },
        (stream) => {
          //
          const resp = JSON.parse(stream)
          console.log(resp)
        }
      )

      controller.getDataAsync().then((data) => {
        if (data.exist === true) {
        } else {
          navigate('/')
        }
      })

      //
    }, 1500)

    return () => {
      clearInterval(timer)
      window.removeEventListener('refresh-watcher', reload)
      window.removeEventListener('reload-workspaces', reload)
    }
  }, [name])

  return (
    <Sidebar collapsible="none" {...props} className="relative h-screen">
      <>{/* <img src={electronSVG} /> */}</>

      <div className=" relative">
        <SidebarHeader>
          <TeamSwitcher key={JSON.stringify(workspaces)} teams={workspaces} />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            {<SidebarGroupLabel>Links</SidebarGroupLabel>}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  {/* <span
                onClick={() => {
                  navigate(item.url)
                }}
              >
                {item.icon}
                <span>{item.name}</span>
              </span> */}

                  <NavLink to={'/'}>
                    <span className={`${'flex items-center justify-center'} `}>{`Home Page`}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70">
                  <MoreHorizontalIcon className="text-sidebar-foreground/70" />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
            </SidebarMenu>
          </SidebarGroup>

          <NavProjects projects={subMenu} />
          <NavMain items={mainMenu} />
        </SidebarContent>

        {/* <SidebarFooter className=" absolute bottom-0 left-0 w-full"> */}
        {/* <NavUser
            user={{
              name: 'HyperEgg AI Folder',
              email: 'AI Smart Folder',
              avatar: '/avatars/shadcn.jpg'
            }}
          /> */}
        {/* </SidebarFooter> */}
        {/* <SidebarRail /> */}
      </div>
    </Sidebar>
  )
}

// {
//   title: 'Models',
//   url: '#',
//   icon: <BotIcon />,
//   items: [
//     {
//       title: 'Genesis',
//       url: '#'
//     },
//     {
//       title: 'Explorer',
//       url: '#'
//     },
//     {
//       title: 'Quantum',
//       url: '#'
//     }
//   ]
// },
// {
//   title: 'Documentation',
//   url: '#',
//   icon: <BookOpenIcon />,
//   items: [
//     {
//       title: 'Introduction',
//       url: '#'
//     },
//     {
//       title: 'Get Started',
//       url: '#'
//     },
//     {
//       title: 'Tutorials',
//       url: '#'
//     },
//     {
//       title: 'Changelog',
//       url: '#'
//     }
//   ]
// },
//
// {
//   title: 'Settings',
//   url: '#',
//   icon: <Settings2Icon />,
//   items: [
//     {
//       title: 'General',
//       url: '#'
//     },
//     {
//       title: 'Team',
//       url: '#'
//     },
//     {
//       title: 'Billing',
//       url: '#'
//     },
//     {
//       title: 'Limits',
//       url: '#'
//     }
//   ]
// }

// {
//   name: 'Sales & Marketing',
//   url: '#',
//   icon: <PieChartIcon />
// },

// {
//   name: 'Travel',
//   url: '#',
//   icon: <MapIcon />
// }

// import { DiamondCanvas } from '@renderer/ui/workspace/3d/DiamondTSL/DiamondCanvas'

// import { AuraExample } from '@renderer/effects/AuraExample'
// import { SearchBar } from '@renderer/effects/SearchBar'

// import electronSVG from '../../src/renderer/src/assets/electron.svg'
// import { AuraExample } from '@renderer/effects/AuraExample'
// import { AuraEffect } from '@renderer/effects/AuraEffect'
// import { SearchBar } from '@renderer/effects/SearchBar'
/*

    [
      {
        name: 'Work Projects',
        logo: <GalleryVerticalEndIcon />,
        plan: 'Startup'
      },
      {
        name: 'Home Projects',
        logo: <AudioLinesIcon />,
        plan: 'Startup'
      },
      {
        name: 'Side Projects',
        logo: <TerminalIcon />,
        plan: 'Startup'
      }
    ]

*/

// This is sample data.
// const data = {
//   user: {
//     name: 'Long Time AI',
//     email: 'Cognitive Offload',
//     avatar: '/avatars/shadcn.jpg'
//   },
//   teams: [
//     {
//       name: 'Work Projects',
//       logo: <GalleryVerticalEndIcon />,
//       plan: 'Startup'
//     },
//     {
//       name: 'Home Projects',
//       logo: <AudioLinesIcon />,
//       plan: 'Startup'
//     },
//     {
//       name: 'Side Projects',
//       logo: <TerminalIcon />,
//       plan: 'Startup'
//     }
//   ],
//   navMain: [
//     {
//       title: 'Playground',
//       url: '#',
//       icon: <TerminalSquareIcon />,
//       isActive: true,
//       items: [
//         {
//           title: 'Setup AI Engine',
//           url: '/setup'
//         },
//         {
//           title: 'Home',
//           url: '/home'
//         },
//         {
//           title: 'Use Skills',
//           url: '/skills'
//         },
//         {
//           title: 'Recursive AI',
//           url: '/recursive-ai'
//         }
//       ]
//     },
//     {
//       title: 'Models',
//       url: '#',
//       icon: <BotIcon />,
//       items: [
//         {
//           title: 'Genesis',
//           url: '#'
//         },
//         {
//           title: 'Explorer',
//           url: '#'
//         },
//         {
//           title: 'Quantum',
//           url: '#'
//         }
//       ]
//     },
//     {
//       title: 'Documentation',
//       url: '#',
//       icon: <BookOpenIcon />,
//       items: [
//         {
//           title: 'Introduction',
//           url: '#'
//         },
//         {
//           title: 'Get Started',
//           url: '#'
//         },
//         {
//           title: 'Tutorials',
//           url: '#'
//         },
//         {
//           title: 'Changelog',
//           url: '#'
//         }
//       ]
//     },
//     {
//       title: 'Settings',
//       url: '#',
//       icon: <Settings2Icon />,
//       items: [
//         {
//           title: 'General',
//           url: '#'
//         },
//         {
//           title: 'Team',
//           url: '#'
//         },
//         {
//           title: 'Billing',
//           url: '#'
//         },
//         {
//           title: 'Limits',
//           url: '#'
//         }
//       ]
//     }
//   ],
//   projects: [
//     {
//       name: 'Design Engineering',
//       url: '#',
//       icon: <FrameIcon />
//     },
//     {
//       name: 'Sales & Marketing',
//       url: '#',
//       icon: <PieChartIcon />
//     },
//     {
//       name: 'Travel',
//       url: '#',
//       icon: <MapIcon />
//     }
//   ]
// }
