'use client';

import { usePathname } from 'next/navigation';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin');
    const isAccountPage = pathname.startsWith('/account');
    const isCheckoutPage = pathname === '/checkout';
    const showGlobalNav = !isAdminPage && !isAccountPage && !isCheckoutPage;

    // WhatsApp button visibility logic
    const showWhatsApp = pathname === '/' ||
        pathname.startsWith('/accesorios') ||
        pathname.startsWith('/coleccionables');

    return (
        <>
            {showGlobalNav && <AnnouncementBar />}
            {showGlobalNav && <Header />}
            {children}
            {showWhatsApp && <WhatsAppButton />}
            {showGlobalNav && <Footer />}
        </>
    );
}
