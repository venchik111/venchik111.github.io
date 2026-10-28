import { Desktop } from "@/components/os/Desktop";
import { Phone } from "@/components/os/Phone";

// Десктоп (Hyprland) и телефон (Phosh) рендерятся оба; какой показать, решает CSS по ширине экрана.
export default function Home() {
  return (
    <div className="os">
      <h1 className="sr-only">
        Иван Соловьев — начинающий Python-разработчик. Портфолио в виде рабочего стола Linux
      </h1>
      <div className="only-desk">
        <Desktop />
      </div>
      <div className="only-phone">
        <Phone />
      </div>
    </div>
  );
}
