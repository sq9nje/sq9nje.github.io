---
title: "Sterownik syntezy Si5351 do odbiorników SDR"
date: 2015-01-01
categories:
  - Elektronika
  - Krótkofalarstwo
  - Arduino
draft: false
---
Po module z układem Si5351 i bibliotece do jego sterowania przyszedł czas, żeby to jakoś wykorzystać w praktyce. Za namową i przy gorącym dopingu Piotra SP9EGM powstał sterownik syntezera przeznaczony dla odbiorników SDR. Projekt oparty jest o Arduino i właściwie składa się z kodu programu oraz schematu połączeń. Kwestię sposobu fizycznego wykonania układu i ewentualnego projektu płytki drukowanej pozostawiam do rozstrzygnięcia czytelnikom. U mnie układ powstał po prostu na płytce stykowej.

## Funkcjonalność
Podstawową funkcją sterownika jest generowanie sygnału taktującego dla detektora kwadraturowego jaki zastosowany jest w większości popularnych odbiorników SDR. Zwykle wymagane jest, by częstotliwość sygnału sterującego była czterokrotnie wyższa niż częstotliwość sygnału odbieranego, a układ Si5351 jest w stanie zapewnić taki sygnał dla całego zakresu KF.

Interakcja ze sterownikiem odbywa się za pomocą taniego enkodera mechanicznego z przyciskiem oraz dwóch klawiszy. Nic nie stoi jednak na przeszkodzie, aby wykorzystać lepszej jakości enkoder optyczny lub magnetyczny – próby pokazały, że współpracują one z układem bez konieczności wprowadzania zmian. Parametry sterownika prezentowane są na standardowym wyświetlaczu LCD 16×2 znaków.

Dodatkowo sterownik umożliwia sterowanie filtrami pasmowymi w zależności od ustawionej częstotliwości. Sterowanie odbywa się za pomocą układu dekodera BCD 4028, co w połączeniu z elastycznym sposobem konfiguracji w kodzie programu sprawia, że sterownik może współpracować z wieloma dostępnymi modułami filtrów (np. [konstrukcji Waldka SP2JJH](http://www.sp2jjh.republika.pl/Transceiver%20Piligrim_pliki/BPF%20by%20SP2JJH%20ver_2.pdf) czy [tymi](http://omega.sp7ptk.pl/index.php/urzadzenia/transceiver-omega-v-2/filtry-pasmowe-v-2) od TRX Omega).

W celu ułatwienia pracy sterownik wyposażono w możliwość zapamiętywania częstotliwości i ich szybkiego przywoływania.

{{< image src="img/si5351_lcd_SDR.png" title="Sterownik SDR Si5351 - Schemat połączeń" >}}

## Konstrukcja
Proponowany schemat połączeń przedstawiony jest na rysunku. Jest to jedynie propozycja, ponieważ kod programu jest elastyczny i umożliwia indywidualną konfigurację wedle preferencji użytkownika. Aby ułatwić dostosowanie programu wszystkie opcje konfiguracyjne umieszczone są w osobnym pliku – config.h. Etykiety połączeń na schemacie są zgodne z nazewnictwem zastosowanym w tym pliku, co powinno rozwiać wszelkie wątpliwości gdyby nazwy okazały się niejednoznaczne.

Jedynymi połączeniami, które absolutnie muszą pozostać tak, jak na załączonym schemacie jest interfejs I2C dla modułu Si5351. Połączenia impulsatora (ENCODER_A i ENCODER_B) również podlegają pewnym ograniczeniom. Otóż ich proste przenoszenie związane tylko ze zmianą numerów pinów w pliku config.h możliwe jest jedynie w zakresie wyprowadzeń D2 – D7. Bardziej zaawansowani użytkownicy mogą przenieść połączenia enkodera również na inne piny Arduino, ale będzie to wymagało zmiany wektora przerwania PCI, do którego podpięta jest procedura obsługi „kręciołka”.

## Program
Program sterownika dostępny jest w postaci skeczu Arduino. Jak już wcześniej wspomniałem wszystkie parametry, które użytkownik może chcieć zmienić starałem się wydzielić do pliku config.h. Do poprawnej kompilacji potrzebna jest oczywiście [biblioteka](https://github.com/sq9nje/si5351) do obsługi Si5351. Dodatkowo wymagana jest jeszcze biblioteka Rotary do obsługi enkodera. Niestety nie znam jej pochodzenia, ale można ją pobrać poniżej wraz z właściwym kodem programu.

*  [Sterownik SDR z Si5351](img/si5351_lcd_SDR.zip)
*  [Biblioteka Rotary](img/Rotary.zip)

## Konfiguracja pasm i filtrów
Na samym końcu pliku config.h znajduje się sekcja ustawień pasm i sterowania filtrów. Opiszę ją w tym miejscu bardziej szczegółowo, by wprowadzanie w niej zmian nie było trudne.

```arduino
/*********************************/
/* Bands & Filters */
/*********************************/
#define BAND_NUM 9
 
PROGMEM const uint32_t lower_limit[] = {1810000, 3500000, 7000000, 10100000, 
                                        14000000, 18068000, 21000000, 24890000, 28000000};
PROGMEM const uint32_t upper_limit[] = {2000000, 3800000, 7200000, 10150000, 14350000,
                                        18168000, 21450000, 24990000, 28700000};
PROGMEM const uint8_t band_filter[] = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9};
 
PROGMEM const char label_0[] = " -- ";
PROGMEM const char label_1[] = "160m";
PROGMEM const char label_2[] = " 80m";
PROGMEM const char label_3[] = " 40m";
PROGMEM const char label_4[] = " 30m";
PROGMEM const char label_5[] = " 20m";
PROGMEM const char label_6[] = " 17m";
PROGMEM const char label_7[] = " 15m";
PROGMEM const char label_8[] = " 12m";
PROGMEM const char label_9[] = " 10m";
 
PROGMEM const char * const band_label[] = {label_0, label_1, label_2, label_3, label_4, 
                                           label_5, label_6, label_7, label_8, label_9};
```

```lower_limit[]``` i ```upper_limit[]``` to odpowiednio tablice z częstotliwościami dolnych i górnych granic pasm. Pasm może być w zasadzie zdefiniowanych dowolnie dużo. Aby dołożyć pasmo trzeba jego granice dopisać do wymienionych wcześniej tablic, dorobić dla niego etykietkę na wzór którejś z linijek z ```label_nn[]``` i dołożyć tą etykietkę do tablicy ```band_label[]```.

Sterowanie filtrami zrealizowane jest za pomocą dekodera 4028, więc filtry mają numery od 0 do 9. Tablica ```band_filter[]``` służy do przypisania każdemu pasmu filtra o odpowiednim numerze. W tym miejscu należy zwrócić uwagę na istotny szczegół – otóż numery pasm to zupełnie inna rzecz niż numery filtrów. Pasmo o numerze 0 zarezerwowane jest do oznaczenia częstotliwości, które nie mieszczą się w żadnym ze zdefiniowanych pasm. Z tego powodu pierwsza pozycja tablicy ```band_filter[]``` przeznaczona jest na numer „filtru” typu bypass – może to być albo zwykła zwora, albo jakiś LPF. Ja w swojej konfiguracji wybrałem dla tego filtru numer 0, ale każdy może sobie to ustalić tak, żeby pasowało do posiadanej płytki filtrów. Pozostałym pasmom można przypisywać dowolne filtry.

W ten sposób nie ma już problemu żeby dołożyć np. pasmo CB tak, żeby było obsługiwane przez filtr z pasma 10m i miało swoją własną etykietkę na wyświetlaczu. Jest to być może trochę skomplikowane, ale mam nadzieję, że będzie to na tyle elastyczne i uniwersalne rozwiązanie, że zadowoli znaczną większość potencjalnych użytkowników.

## Obsługa
Obsługa sterownika powinna być raczej intuicyjna. W normalnym trybie pracy enkoder powoduje zmianę częstotliwości generowanego sygnału. Krok przestrajania wyświetlany jest w prawym dolnym rogu ekranu, a zmienia się go cyklicznie przez naciśnięcie przycisku enkodera.

W środkowej części dolnego wiersza wyświetlana jest informacja o pasmie, w którym znajduje się aktualna częstotliwość. Jeśli częstotliwość ta nie mieści się w żadnym ze zdefiniowanych pasm, wyświetlane jest „–” co sygnalizuje, że włączony jest filtr „bypass”.

{{< image src="img/si5351_sdr_normal.png" caption="Tryb normalny" width=300 >}}

Wciśnięcie przycisku BUTTON_1 powoduje wejście do trybu przywracania pamięci (Memory Recall). W trybie tym w lewym dolnym rogu ekranu wyświetlany jest numer komórki pamięci. Następująca po nim literka „r” przypomina, że jesteśmy w trybie przywracania, a nie zapisu. Wyświetlacz pokazuje zapisaną w danej komórce częstotliwość i odpowiadające jej pasmo. Pomiędzy komórkami poruszamy się za pomocą enkodera. Ponowne wciśnięcie przycisku BUTTON_1 powoduje ustawienie częstotliwości  z aktualnej komórki pamięci i powrót do normalnego trybu pracy. Wciśnięcie zaś przycisku BUTTON_2 powoduje opuszczenie trybu przywracania pamięci bez żadnych zmian.

{{< image src="img/si5351_sdr_recall.png" caption="Tryb przywoływania pamięci" width=300 >}}

Tryb zapisu pamięci (Memory Save) uruchamiany jest przyciskiem BUTTON_2 i oznaczony jest literką „s” przy numerze komórki pamięci. W trybie tym mamy możliwość zapisania bieżącej częstotliwości w wybranej komórce pamięci. Ponowne wciśnięcie przycisku BUTTON_2 porzuca tryb zapisu, natomiast wciśnięcie przycisku BUTTON_1 zatwierdza operację i wraca do normalnego trybu pracy.

{{< image src="img/si5351_sdr_save.png" caption="Tryb zapisu pamięci" width=300 >}}