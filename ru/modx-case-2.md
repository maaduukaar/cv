# Добавление новых блоков на страницу

## Задача

В разделе «Наша команда» добавить заголовки и фотографии для должностей:

- Менеджер по работе с клиентами
- Менеджер по закупкам

::: tip Особенность ModX
Если бы мы работали с простым статическим html сайтом, то эта задача заняла бы очень незначительное время, но поскольку в ModX есть возможность вывода любых данных в административную панель для последующего их изменения редакторами, на данной платформе подобные задачи занимают в несколько раз больше времени, чем обычно.
:::

## Ход действий

В разделе Ресурсы, я нашёл необходимую страницу для редактирования:

![](/ru/images/modx-case-2/modx-case-2-1.png)

И определил её шаблон.

Далее, в разделе Элементы, нашёл данный шаблон:

![](/ru/images/modx-case-2/modx-case-2-2.png)

Ознакомился с его HTML-кодом:

```html:line-numbers {56-64}
[[$header]]
    
    <section class="section-page">
        <div class="container">
            [[!pdoCrumbs?
                &showHome=`1`
                &showAtHome=`0`
                &tplWrapper=`breadcrumb`
                &tpl=`breadcrumb-li`
                &tplCurrent=`breadcrumb-li-active`
            ]]
            
            <h1 class="section-page__header">[[!*longtitle:default=`[[!*pagetitle]]`]]</h1>
            
            <div class="nasha-comanda">
            <h2 class="doljnost-text">Гендиректор</h2>
            <div class="row">
                [[!getImageList?
                  &tvname=`gen-images`
                  &tpl=`gen-imageTpl`
                  &toPlaceholder=`gen-imageTpl`
                ]]
                [[!+gen-imageTpl]]
            </div>
            
            <h2 class="doljnost-text">Управляющий</h2>
            <div class="row">
                [[!getImageList?
                  &tvname=`uprav-images`
                  &tpl=`uprav-imageTpl`
                  &toPlaceholder=`uprav-imageTpl`
                ]]
                [[!+uprav-imageTpl]]
            </div>
            
            <h2 class="doljnost-text">Старшие техники</h2>
            <div class="row">
                [[!getImageList?
                  &tvname=`scary-images`
                  &tpl=`scary-imageTpl`
                  &toPlaceholder=`scary-imageTpl`
                ]]
                [[!+scary-imageTpl]]
            </div>
            
            <h2 class="doljnost-text">Администраторы</h2>
            <div class="row">
                [[!getImageList?
                  &tvname=`admin-images`
                  &tpl=`admin-imageTpl`
                  &toPlaceholder=`admin-imageTpl`
                ]]
                [[!+admin-imageTpl]]
            </div>
            
            <h2 class="doljnost-text">Техники</h2>
            <div class="row">
                [[!getImageList?
                  &tvname=`technick-images`
                  &tpl=`technick-imageTpl`
                  &toPlaceholder=`technick-imageTpl`
                ]]
                [[!+technick-imageTpl]]
            </div>
            
            [[!getImageList?
                        &tvname=`people-images`
                        &tpl=`people-imagesTpl`
                        &docid=`[[*id]]`
                        &limit=`0`
                        &toPlaceholder=`people-images`
                    ]]
                    [[!+people-images:notempty=`
                        <section class="section__page instruments">
                            <div class="container">
                                <div class="row">
                                    [[!+people-images]]
                                </div>
                            </div>
                        </section>
                        `]]
            </div>
            
        </div>
    </section>
[[$footer]]
```

Вследствие чего стало ясно, копии каких чанков и дополнительных полей мне необходимо сделать, чтобы по аналогии с существующими секциями добавить две новые.

За шаблон я взял блок Техники:

            <h2 class="doljnost-text">Техники</h2>
            <div class="row">
                [[!getImageList?
                  &tvname=`technick-images` <!-- [!code focus] -->
                  &tpl=`technick-imageTpl` <!-- [!code focus] -->
                  &toPlaceholder=`technick-imageTpl`             
                ]]
                [[!+technick-imageTpl]]
            </div>
```

Из него мы видим, что нам нужны элементы **technick-images** и **technick-imageTpl**.

Далее, в разделе Элементы, в секции Дополнительные поля (TV), я нашёл элемент **technick-images**:

![](/ru/images/modx-case-2/modx-case-2-3.png)

И копировал его с новым названием:

![](/ru/images/modx-case-2/modx-case-2-4.png)

После чего, нашёл чанк **technick-imageTpl**:

![](/ru/images/modx-case-2/modx-case-2-5.png)

После чего в коде скопированного чанка поправил заголовки:

![](/ru/images/modx-case-2/modx-case-2-6.png)

Далее вернулся в первоначальный шаблон Галерея:

![](/ru/images/modx-case-2/modx-case-2-7.png)

И в его HTML-коде, добавил новый блок, модифицировав его из блока Техники:

```html:line-numbers
            <h2 class="doljnost-text">Менеджер по работе с клиентами</h2>
            <div class="row">
                [[!getImageList?
                  &tvname=`client-manager-images`
                  &tpl=`client-manager-imageTpl`
                  &toPlaceholder=`client-manager-imageTpl`
                ]]
                [[!+client-manager-imageTpl]]
            </div>
```

Далее сохранил шаблон.

Проверил результат, по пути Ресурсы -> Наша команда -> Дополнительные поля --> Наша команда:

![](/ru/images/modx-case-2/modx-case-2-8.png)

Появился новый блок, который я добавил:

![](/ru/images/modx-case-2/modx-case-2-9.png)

Далее, я аналогично добавил блок Менеджер по закупкам.

После чего заполнил их новыми фотографиями.

## Результат

В результате структура страницы была расширена двумя новыми блоками, полностью интегрированными в административную панель. Это обеспечивает заказчику полную автономность в управлении контентом и исключает необходимость привлечения разработчика для будущих обновлений.