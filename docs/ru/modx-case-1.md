# Редактирование свойств полей в форме заполнения заказа

Клиенту необходимо было изменить свойства нескольких полей в форме заполнения заказа.

![](/ru/images/modx-case-1/modx-case-1-1.png)

Для выбора цвета зубов, вместо выпадающей палитры, сделать поля со свободным вводом данных, с валидацией:

<figure>
  <img src="/ru/images/modx-case-1/modx-case-1-2.png">
  <figcaption>Демонстрация поля с выбором цвета из палитры</figcaption>
</figure>

Для решения этой задачи, я получил от клиента доступ к super-admin пользователю, поскольку доступ для редактирования данной формы был только у этого высокоуровневого пользователя.

В административной панели перешёл в раздел Ресурсы, и выбрал необходимую страницу:

![](/ru/images/modx-case-1/modx-case-1-3.png)

Перешёл в единственный дочерний ресурс нажав кнопку "Редактировать":

![](/ru/images/modx-case-1/modx-case-1-4.png)

И определил название шаблона:

![](/ru/images/modx-case-1/modx-case-1-5.png)

Шаблон "Форма для заполнения"

Далее в разделе Элементы, изучил секцию Шаблоны:

![](/ru/images/modx-case-1/modx-case-1-6.png)

Внутри которой нашёл шаблон формы, которую необходимо отредактировать:

![](/ru/images/modx-case-1/modx-case-1-7.png)

Далее в HTML-коде шаблона, определил, что форма загружается из чанка contactFormTpl:

![](/ru/images/modx-case-1/modx-case-1-8.png)

В разделе Элементы, в секции Чанки, нашёл необходимый:

![](/ru/images/modx-case-1/modx-case-1-9.png)

Изучил HTML-код чанка:

![](/ru/images/modx-case-1/modx-case-1-10.png)

И определил, что форма загружается из чанка с названием defaultForm1.

Далее, в том же разделе Чанки, нашёл defaultForm1:

![](/ru/images/modx-case-1/modx-case-1-11.png)

Изучение HTML-кода которого показало, что это финальная точка, редактирование которой позволит изменить содержимое страницы:

![](/ru/images/modx-case-1/modx-case-1-12.png)

Далее я сделал бэкап кода чанка, для возможности вернуться к исходному состоянию при непредвиденных обстоятельствах:

![](/ru/images/modx-case-1/modx-case-1-13.png)

И, приступил к редактированию страницы.

Определил, что за вывод палитры отвечает параметр type="color" в форме input:

```html
<input id="qult-color"
       type="color"
       class="color3-box form-control[[!+fi.error.bok-color:notempty=` error`]]"
       name="qult-color"
       value="#3d41a6">
```

И заменил его на параметр type="text", убрав лишние параметры и добавив описание поля по умолчанию:

```html
<input id="qult-color"
       type="text"
       maxlength="15"
       class="form-control[[!+fi.error.qult-color:notempty=` error`]]"
       name="qult-color"
       placeholder="Например: жёлтый, тёмный, A1, A2">
```

Также было добавлено ограничение на длину вводимого текста.

В форме с необходимостью более точного ввода данных:

```html
<div class="col-md-12 col-lg-9">
   <input id="bok-color"
          type="color"
          class="color3-box form-control[[!+fi.error.bok-color:notempty=` error`]]" 
          name="bok-color" 
          value="#3d41a6">
</div>
```

Добавил валидацию значений поля ввода:

```html
<div class="col-md-12 col-lg-9">
    <input id="bok-color"
           type="text"
           required
           class="form-control[[!+fi.error.bok-color:notempty=` error`]]"
           name="bok-color"
           placeholder="Допустимы только значения по шкале VITA: A1–A4, A3.5, B1–B4, C1–C4, D1–D4, BL1–BL4"
           pattern="^(A(1|2|3(\.5)?|4)|[BCD](1|2|3|4)|BL(1|2|3|4))">
</div>
```

То же самое проделал и с другими аналогичными полями.

Далее нажал кнопку Сохранить, в верхней части страницы редактирования чанка:

![](/ru/images/modx-case-1/modx-case-1-14.png)

После чего, проверил результат на странице:

![](/ru/images/modx-case-1/modx-case-1-15.png)

![](/ru/images/modx-case-1/modx-case-1-16.png)

Правки применились в соответствии с ожиданиями.

Также, с помощью CSS была добавлена интерактивность ввода данных:

```html
<style>
    input:not(:placeholder-shown):invalid {
        border-color: #dc3545;
        box-shadow: 0 0 0 0.15rem rgba(220, 53, 69, 0.25);
    }
    
    input:not(:placeholder-shown):valid {
        border-color: #28a745;
    }
</style>
```

Пользователю сразу становится заметно в момент ввода данных в поле будет ли оно валидировано при отправке формы:

<figure>
  <img src="/ru/images/modx-case-1/modx-case-1-17.png" alt="Недопустимое значение">
  <figcaption>Недопустимое значение подсвечивает форму ввода красным цветом</figcaption>
</figure>

<figure>
  <img src="/ru/images/modx-case-1/modx-case-1-18.png" alt="Допустимое значение">
  <figcaption>Допустимое — зелёным</figcaption>
</figure>

Также данный CSS-код учитывает наличие данных — пустое поле не будет подсвечено.

Далее, я заполнил форму тестовыми данными, отправил её, и убедился в том, что данные из изменённых полей сохраняются:

![](/ru/images/modx-case-1/modx-case-1-19.png)

Проверка прошла успешно.

После чего клиенту был предоставлен отчёт, о внесённых изменениях.