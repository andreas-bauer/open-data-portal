import SettingsIcon from '@mui/icons-material/Settings';
import WavesIcon from '@mui/icons-material/Waves';
import EqualizerIcon from '@mui/icons-material/BarChart';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import GitHubIcon from '@mui/icons-material/GitHub';

import Link from 'next/link';
import { useState } from 'react';

import style from 'src/styles/Nav.module.css'
import PreferenceModal from 'src/components/PreferenceModal';

const NavLink = ({name, href, Icon}) => {
    return (
        <Link href={href} key={href}>
            <div className={style.navItem}>
                <Icon className={style.icon}/>
                {name && <h4 className={style.header}>{name}</h4>}
            </div>
        </Link>
    );
}
const NavButton = ({name, onClick, Icon}) => {
    return (
        <div className={style.navItem} onClick={onClick}>
            <Icon className={style.icon}/>
            {name && <h4 className={style.header}>{name}</h4>}
        </div>
    );
}

export default function Navbar ({ setPreferences }) {
    const [isOpen, setIsOpen] = useState(false);
    const closePreferenceModal = () => setIsOpen(false);
    const openPreferenceModal = () => setIsOpen(true);

    return (
        <nav>
            <div className={style.nav}>
                <div className={style.navHalf}>
                    <NavLink name="Sensor Network" href="/" Icon={WavesIcon}/>
                </div>

                <div className={style.navHalf}>
                    <NavLink name="Visualize Data" href="/data" Icon={EqualizerIcon}/>
                    <NavLink name="API Docs" href="/docs" Icon={LibraryBooksIcon}/>
                    <NavLink href="https://github.com/sensor-network/open-data-portal" Icon={GitHubIcon}/>
                    <NavButton onClick={openPreferenceModal} Icon={SettingsIcon}/>
                </div>
            </div>
            {isOpen && <PreferenceModal isOpen={isOpen} closeModal={closePreferenceModal} setPreferences={setPreferences}/>}
        </nav>
    );
}