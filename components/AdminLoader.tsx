import Image from "next/image";

export default function AdminLoader({ fullScreen = false }: { fullScreen?: boolean }) {
  const content = (
    <div className={fullScreen ? "eg-admin-loading-center" : "eg-inline-loader"}>
      <div className={fullScreen ? "eg-admin-loading-absolute text-center" : "text-center"}>
        <div className="eg-loader">
          <div className="eg-loader-spin" />
        </div>
        <div className="mt-8 flex justify-center">
          <Image
            src="/insanegenix/logo/logo-white.png"
            alt="InsaneGenix"
            width={170}
            height={40}
            className="h-10 w-auto object-contain"
          />
        </div>
        <p className="mt-3 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-500">
          Loading admin
        </p>
      </div>
    </div>
  );

  if (fullScreen) {
    return <div className="eg-admin-loading">{content}</div>;
  }

  return content;
}
