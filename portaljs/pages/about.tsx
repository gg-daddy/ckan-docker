import { ThaiGovLayout, useThaiLanguage } from '@/components/thailand';

// Bilingual content
const content = {
  title: { th: 'เกี่ยวกับเรา', en: 'About the Open Data Portal' },
  mission: { th: 'พันธกิจของเรา', en: 'Our Mission' },
  missionText: {
    th: 'เราเชื่อมั่นในพลังของข้อมูลเปิดในการขับเคลื่อนความโปร่งใส การวิจัย และนวัตกรรม โดยให้การเข้าถึงชุดข้อมูลคุณภาพสูงได้ง่าย เรามุ่งหวังที่จะเสริมพลังให้กับนักวิจัย นักพัฒนา และประชาชน',
    en: 'We believe in the power of open data to drive transparency, enable research, and spark innovation. By providing easy access to high-quality datasets, we aim to empower researchers, developers, and citizens alike.',
  },
  technology: { th: 'เทคโนโลยี', en: 'Technology' },
  technologyText: {
    th: 'พอร์ทัลนี้สร้างขึ้นโดยใช้ CKAN ซึ่งเป็นระบบจัดการข้อมูลโอเพนซอร์สชั้นนำของโลก ร่วมกับ PortalJS ซึ่งเป็นเฟรมเวิร์กฟรอนต์เอนด์สมัยใหม่สำหรับพอร์ทัลข้อมูล',
    en: 'This portal is built using CKAN, the world-leading open-source data management system, combined with PortalJS, a modern frontend framework for data portals.',
  },
  getInvolved: { th: 'มีส่วนร่วม', en: 'Get Involved' },
  getInvolvedText: {
    th: 'เรายินดีรับการมีส่วนร่วมจากชุมชน ไม่ว่าคุณจะมีข้อมูลที่ต้องการแบ่งปัน ข้อเสนอแนะเกี่ยวกับแพลตฟอร์ม หรือต้องการช่วยปรับปรุงพอร์ทัลของเรา เราอยากรับฟังจากคุณ',
    en: 'We welcome contributions from the community. Whether you have data to share, feedback on the platform, or want to help improve our portal, we would love to hear from you.',
  },
  contact: { th: 'ติดต่อ', en: 'Contact' },
  contactText: {
    th: 'สำหรับคำถามหรือข้อเสนอแนะ กรุณาติดต่อผ่านช่องทางอย่างเป็นทางการของเรา',
    en: 'For questions or feedback, please reach out through our official channels.',
  },
  welcome: {
    th: 'ยินดีต้อนรับสู่ศูนย์ข้อมูลเปิดภาครัฐ แพลตฟอร์มสำหรับค้นหา เข้าถึง และแบ่งปันชุดข้อมูลสาธารณะ พันธกิจของเราคือทำให้ข้อมูลเข้าถึงได้สำหรับทุกคนและส่งเสริมนวัตกรรมผ่านข้อมูลเปิด',
    en: 'Welcome to our Open Data Portal, a platform for discovering, accessing, and sharing public datasets. Our mission is to make data accessible to everyone and foster innovation through open data.',
  },
};

function AboutContent() {
  const { t } = useThaiLanguage();

  return (
    <div className="container-main py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-th-navy-600 mb-6">
          {t(content.title)}
        </h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-lg text-gray-600 mb-6">
            {t(content.welcome)}
          </p>

          <h2 className="text-xl font-semibold text-th-navy-600 mt-8 mb-4">
            {t(content.mission)}
          </h2>
          <p className="text-gray-600">
            {t(content.missionText)}
          </p>

          <h2 className="text-xl font-semibold text-th-navy-600 mt-8 mb-4">
            {t(content.technology)}
          </h2>
          <p className="text-gray-600">
            {t(content.technologyText)}{' '}
            <a href="https://ckan.org" target="_blank" rel="noopener noreferrer" className="text-th-orange-500 hover:underline">CKAN</a>
            {' & '}
            <a href="https://portaljs.org" target="_blank" rel="noopener noreferrer" className="text-th-orange-500 hover:underline">PortalJS</a>
          </p>

          <h2 className="text-xl font-semibold text-th-navy-600 mt-8 mb-4">
            {t(content.getInvolved)}
          </h2>
          <p className="text-gray-600">
            {t(content.getInvolvedText)}
          </p>

          <h2 className="text-xl font-semibold text-th-navy-600 mt-8 mb-4">
            {t(content.contact)}
          </h2>
          <p className="text-gray-600">
            {t(content.contactText)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <ThaiGovLayout title="About" description="About the Open Data Portal">
      <AboutContent />
    </ThaiGovLayout>
  );
}
