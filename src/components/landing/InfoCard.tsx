import Image from "next/image";

interface InfoCardProps {
  icon: string;
  alt: string;
  title: string;
  subtitle: string;
  body: string;
  comingSoon?: boolean;
}

function InfoCard({icon, alt, title, subtitle, body, comingSoon}: InfoCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-8 w-full max-w-2xl">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 flex items-center justify-center">
          <Image src={icon} alt={alt} width={64} height={64} className="w-16 h-16" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-bold text-xl leading-tight">{title}</h2>
            {comingSoon && (
              <span className="px-3 py-1 rounded-full bg-blue-400 text-white text-xs font-semibold shadow">
                Coming Soon
              </span>
            )}
          </div>
          <p className="mt-2 text-base font-semibold">{subtitle}</p>
          <p className="mt-2 text-base">{body}</p>
        </div>
      </div>
    </div>
  )
}

export default InfoCard;