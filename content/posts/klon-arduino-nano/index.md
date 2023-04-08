---
title: "Klon Arduino Nano"
date: 2012-09-13
categories:
  - Arduino
  - Elektronika
  - Sprzęt
draft: false
---
Arduino jest bardzo popularną platformą developerską dla mikrokontrolerów AVR. Swoją popularność zawdzięcza zapewne kilku czynnikom, między innymi IDE, które w prosty sposób pozwala tworzyć firmware nawet niedoświadczonym programistom oraz dobrze opracowanej płytce uruchomieniowej. Dzięki temu, że cały projekt jest open source i został udostępniony na licencji Creative Commons powstało wiele dodatkowych „tarcz” z peryferiami rozszerzającymi możliwości podstawowej płytki oraz biblioteki kodu do obsługi tych peryferiów. Społeczność ludzi aktywnie wykorzystujących Arduino w swoich projektach ciągle rośnie.


{{< image src="img/arduino_boards.jpg" caption="Puste plytki" >}} 
{{< image src="img/arduino.jpg" caption="Arduino Nano - Gotowy moduł" >}}

Z biegiem czasu powstało też wiele wersji podstawowej płytki Arduino np. Duemillenuove, UNO itp. Nano jest jedną z najmniejszych wersji sprzętu kompatybilnego z Arduino. Jest to modulik DIP przeznaczony do budowania prototypów na płytkach stykowych itp. Ponieważ udało mi się kupić kilka sztuk ATmega328P w dobrej cenie, a od dawna myślałem o małych modułach eksperymentalnych, postanowiłem spróbować zrobić własny klon Nano.

Arduino Nano zostało opracowane przez firmę Gravitech i jak to zwykle bywa, miało kilka wersji w tym taką, zrobioną na czterowarstwowym druku. Ja swój moduł oparłem o najnowszą wersję 3.0. Schemat tego modułu jest właściwie bardzo prosty. Wszystkie porty mikrokontrolera ATmega328 zostały wyprowadzone na złącza goldpin. Układ FT232RL w typowej dla siebie aplikacji odpowiada za konwersję USB – RS232. Ciekawym rozwiązaniem jest podłączenie wyjścia DTR poprzez kondensator 100nF do pinu RESET mikrokontrolera. Pozwala to na automatyczne resetowanie procesora za pomocą portu szeregowego co jest wykorzystywane przez bootloader – ale o tym za chwilę. Układ zasilany jest z portu USB, choć można podłączyć do niego również zewnętrzne zasilanie 5V, na płytce znajduje się też dodatkowy stabilizator, który pozwoli zasilić urządzenie wyższym napięciem. Jedyną różnicą układową w stosunku do oryginalnego Nano jest brak diody LED podłączonej do pinu D13. Decyzję taką podjąłem, ponieważ chciałem mieć uniwersalny i minimalistyczny modulik, choć teraz, kiedy już chwilę używam tych modułów, doszedłem do wniosku, że był to błąd – ta dioda byłaby bardzo wygodnym narzędziem diagnostycznym.

## Projekt

Chęć zachowania kompatybilności mechanicznej z oryginałem – moduł miał mieć dwa rzędy po 15 goldpinów w odstępie 600 mils – podyktowała konieczność zaprojektowania dwustronnej płytki drukowanej. W dodatku nieunikniony był obustronny montaż elementów, rozwiązanie niezbyt optymalne pod względem kosztów produkcji przemysłowej, bo wymusza dwukrotne przejście płytki przez automaty pick & place, podklejanie elementów żeby nie pospadały w piecu itp. Cóż, miniaturyzacja nie przychodzi łatwo… Dzięki temu, że sam projektowałem płytkę, mogłem przystosować ją do posiadanych i łatwo dostępnych elementów. Zasadniczo wszystkie elementy bierne są w rozmiarze 0603, ale footprinty są na tyle duże, że przy odrobinie wprawy można spokojnie wlutować 0805.

Routing tak małej płyteczki dla niezbyt doświadczonego projektanta jak ja okazał się niezłą gimnastyką :) Ścieżki poprowadzone są w reżimie 8 mils / 8 mils, ale celowo przelotki zrobiłem dosyć duże z otworkami średnicy 0.4 mm. Niestety w moim domowym warsztacie takiej płytki wykonać nie mogę, więc przygotowałem dokumentację w postaci plików Gerber i wysłałem projekt do fabryki. Już po trzech tygodniach w skrzynce pocztowej czekała koperta z dziesięcioma płytkami, z czego 8 było testowanych elektrycznie.

Jakość płytek jakie otrzymałem jest bardzo dobra. Wykonane są na laminacie FR4 1.2 mm z soldermaską i dwustronnym opisem. Krawędzie są frezowane, więc mogłem sobie pozwolić na ekstrawagancję zaokrąglenia rogów. Są też bardzo gładkie. Na takich płytkach montaż to czysta przyjemność i już po chwili miałem gotowy i działający pierwszy egzemplarz.

*  [Schemat](img/arduino_nano_schematics.pdf)
*  [Projekt Eagle](img/arduino_nano.zip)

## Bootloader

Po zmontowaniu płytki i podłączeniu do komputera konieczna jest instalacja sterowników do układu FT232RL. Mój Windows 7 znalazł je automatycznie, ale można je też pobrać ze strony producenta. Jeśli wszystko przebiegło pomyślnie powinniśmy mieć w swoim systemie nowy port COM. Jego nazwę można zweryfikować za pomocą Menedżera Urządzeń.

Aby móc łatwo i wygodnie programować nasz moduł z IDE Arduino, warto wgrać do mikrokontrolera bootloader. Arduino dostarczane jest wraz z zestawem skompilowanych standardowych bootloaderów. IDE pozwala przeprowadzić operację programowania bootloadera automatycznie, nie trzeba się właściwie nad niczym zastanawiać, choć potrzebny będzie do tego programator. W menu Tools -> Board wybieramy Arduino Nano w/ ATmega328. Spowoduje to wybranie konfiguracji odpowiedniej dla naszej płytki. W menu Tools -> Programmer wybieramy posiadany przez nas programator. Ja zastosowałem Bus Pirate. Na koniec wybieramy Tools -> Burn Bootloader i już po chwili cieszymy się wynikami naszej pracy.

Od tej pory nie trzeba już używać programatora aby załadować nasze programy do mikrokontrolera. Dostarczony wraz z Arduino bootloader emuluje programator Atmel stk500. Po resecie mikrokontrolera bootloader czeka około jednej sekundy na rozpoczęcie programowania. W oryginalnej płytce Arduino Nano sygnalizowane jest mignięciem diodą podłączoną do wyjścia D13. Jak pisałem wcześniej, mój moduł nie posiada tej diody, więc trzeba pamiętać, że podczas startu modułu na wyprowadzeniu D13 pojawi się na chwilkę stan wysoki (być może przyda się to do resetowania peryferiów?). Jeśli bootloader nie wykryje próby programowania, to następuje skok do właściwego programu.

W Arduino Nano został zastosowany sprytny trick, który pozwala na automatyczne resetowanie mikrokontrolera. Linię DTR portu szeregowego podłączono do nogi RESET poprzez kondensator 100n. Krótkie „machnięcie” stanem linii DTR powoduje więc zresetowanie mikrokontrolera. Pozwala to ułatwić proces programowania – nie trzeba już resetować układu przyciskiem, IDE Arduino potrafi to zrobić automatycznie.
