---
title: "Interfejs do emisji cyfrowych i CAT"
date: 2013-07-07
categories:
  - Elektronika
  - Krótkofalarstwo
  - Sprzęt
draft: false
---
Interfejs do emisji cyfrowych to właściwie bardzo prosta rzecz. W wersji minimalistycznej mogą to być dwa lub trzy kable do transmisji sygnałów z karty dźwiękowej komputera do TRXa. Z komputerowym sterowaniem radiostacją sprawa może wyglądać nieco bardziej skomplikowanie, choć pewnie nie musi. Ponieważ jednak gotowe rozwiązania dostępne na rynku są albo drogie, albo nie spełniają moich oczekiwań, postanowiłem opracować własną konstrukcję.

{{< image src="img/cat_front.jpg" caption="Interfejs CAT - Panel przedni" >}}
{{< image src="img/cat_back.jpg" caption="Interfejs CAT - Panel tylny" >}}
{{< image src="img/cat_inside.jpg" caption="Interfejs CAT - wnętrze" >}}

Tak się składa, że w swoim shacku posiadam dwa transcivery ze stajni Yaesu: FT817ND i FT897D. Oba pod względem sterowania zewnętrznego są praktycznie identyczne, mają nawet takie same gniazdka. Interfejs CAT wyprowadzony jest jako RS232 na poziomach TTL, dostępne są też sygnały audio. Nie pozostało więc nic innego jak zabrać się do roboty. Ponieważ nowoczesne komputery często nie są już wyposażone w interfejs RS232C, moje urządzenie miało posiadać odpowiedni konwerter USB. Kolejną pożądaną cechą, której nie mają dostępne tanie interfejsy, jest separacja galwaniczna zarówno interfejsu CAT jak i toru audio.

## Budowa
Ogólnie całe urządzenie nie jest specjalnie odkrywczą konstrukcją, wzorowane było na wielu opisach dostępnych w sieci. Nie oznacza to, że nie obyło się bez kilku prototypów i paru eksperymentów, a i tak nie ustrzegłem się błędów…

Konwerter USB – RS232 to właściwie typowa aplikacja układu FT232RL. Cała zabawa polegała na odpowiednim wykonaniu separacji galwanicznej. Posiadane przeze mnie radia oferują trzy szybkości przesyłania danych przez CAT, najszybsza to 38400 bps. Okazało się, że uzyskanie tej szybkości nie jest proste i przy zastosowaniu bardzo popularnych transoptorów typu PC817 było niemożliwe. Dopiero zastosowanie transoptorów TLP621 (również łatwo dostępnych i niedrogich) i odpowiedni dobór rezystorów polaryzacyjnych zaowocował sukcesem. Jak widać na oscylogramie, uzyskany przebieg jest czysty. Co najważniejsze, testy praktyczne z TRXami wykazały, że stromość zboczy jest wystarczająca do niezawodnej i stabilnej pracy interfejsu.

{{< image src="img/tlp621_40k.png" caption="Przebieg na TLP621" >}}

Poza sygnałami RXT i TXD interfejsu szeregowego, wyprowadzone zostały też linie DTR i RTS, oczywiście również przez transoptory. Pozwala to na bezpośrednie kluczowanie PTT i CW w radiu kiedy nie chcemy lub nie możemy użyć interfejsu CAT.

Tor audio został zrealizowany w typowy sposób za pomocą transformatorków separacyjnych. Wybrałem transformatory firmy Critchley kupione na Allegro ze względu na dostępność. Nic nie stoi jednak na przeszkodzie, by zastosować transformatorki wymontowane np. ze strych modemów telefonicznych. Należy jednak zwrócić uwagę, że miewają one różne rozmiary i układ wyprowadzeń. W torze audio przewidziałem możliwość montażu potencjometrów do regulacji poziomu sygnału, ostatecznie jednak zrezygnowałem z ich instalacji zastępując zworami.

Całość układu można zobaczyć na załączonym [schemacie](img/cat_schemat.pdf).

## Wykonanie
Kiedy już miałem w miarę dopracowany układ postanowiłem zaprojektować i zamówić fabryczną płytkę drukowaną. Płytka została zwymiarowana  tak, by pasowała do plastikowej obudowy Z-6. Dwustronną płytkę zamówiłem w swojej ulubionej płytkarni w Chinach. Kiedy dostałem już gotowe PCB, okazało się, że w wyniku drobnej zmiany zrobionej w ostatniej chwili przed wysłaniem zamówienia, na płytce zabrakło połączenia z masa w okolicy układu scalonego. Udało się to poprawić ostrożnie lutując malutkie zworki z kynaru, ale mam już nauczkę, by zawsze przed wygenerowaniem Gerberów uruchomić jeszcze ostatni raz DRC! W załączonym projekcie Eagle błąd ten został już poprawiony.

Na płytce drukowanej przewidziałem gniazdo MiniDIN 8 do podłączenia kabla do TRXa. Kiedy jednak zobaczyłem jak ciasno jest w takiej wtyczce i jak u…ciążliwe jest jej przylutowanie, w ostatecznej wersji zamontowałem na tylnej ściance obudowy złącze DB9 – trochę trudniej wyciąć otwór, ale za to jest znacznie mniej klaustrofobicznie.

Panel czołowy i tylni został zaprojektowany w programie graficznym i wydrukowany na papierze samoprzylepnym na drukarce laserowej. Dla zabezpieczenia na papier została jeszcze naklejona przezroczysta folia.

## Do pobrania
*  [Schemat](img/cat_schemat.pdf)
*  [Projek Eagle](img/cat.zip)