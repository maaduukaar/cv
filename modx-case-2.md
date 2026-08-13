# Adding New Blocks to a Page

## Task

Add headings and photographs for the following positions to the "Our Team" section:

- Client Relations Manager
- Purchasing Manager

::: tip A Feature of ModX
If we were working with a simple static HTML website, this task would take very little time. However, ModX makes it possible to expose any data in the administration panel so that editors can modify it later. On this platform, tasks like this take several times longer than usual.
:::

## Course of Action

In the Resources section, I found the required page to edit:

![](/ru/images/modx-case-2/modx-case-2-1.png)

And identified its template.

Next, in the Elements section, I found this template:

![](/ru/images/modx-case-2/modx-case-2-2.png)

I reviewed its HTML code:

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
            <h2 class="doljnost-text">CEO</h2>
            <div class="row">
                [[!getImageList?
                  &tvname=`gen-images`
                  &tpl=`gen-imageTpl`
                  &toPlaceholder=`gen-imageTpl`
                ]]
                [[!+gen-imageTpl]]
            </div>

            <h2 class="doljnost-text">Managing Director</h2>
            <div class="row">
                [[!getImageList?
                  &tvname=`uprav-images`
                  &tpl=`uprav-imageTpl`
                  &toPlaceholder=`uprav-imageTpl`
                ]]
                [[!+uprav-imageTpl]]
            </div>

            <h2 class="doljnost-text">Senior Technicians</h2>
            <div class="row">
                [[!getImageList?
                  &tvname=`scary-images`
                  &tpl=`scary-imageTpl`
                  &toPlaceholder=`scary-imageTpl`
                ]]
                [[!+scary-imageTpl]]
            </div>

            <h2 class="doljnost-text">Administrators</h2>
            <div class="row">
                [[!getImageList?
                  &tvname=`admin-images`
                  &tpl=`admin-imageTpl`
                  &toPlaceholder=`admin-imageTpl`
                ]]
                [[!+admin-imageTpl]]
            </div>

            <h2 class="doljnost-text">Technicians</h2>
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

This made it clear which chunks and template variables I needed to copy in order to add two new sections by analogy with the existing ones.

I used the Technicians block as the template:

```html
            <h2 class="doljnost-text">Technicians</h2>
            <div class="row">
                [[!getImageList?
                  &tvname=`technick-images` <!-- [!code focus] -->
                  &tpl=`technick-imageTpl` <!-- [!code focus] -->
                  &toPlaceholder=`technick-imageTpl`
                ]]
                [[!+technick-imageTpl]]
            </div>
```

This shows that we need the **technick-images** and **technick-imageTpl** elements.

Next, in the Elements section, under Template Variables (TVs), I found the **technick-images** element:

![](/ru/images/modx-case-2/modx-case-2-3.png)

And copied it with a new name:

![](/ru/images/modx-case-2/modx-case-2-4.png)

After that, I found the **technick-imageTpl** chunk:

![](/ru/images/modx-case-2/modx-case-2-5.png)

Then I corrected the headings in the copied chunk's code:

![](/ru/images/modx-case-2/modx-case-2-6.png)

Next, I returned to the original Gallery template:

![](/ru/images/modx-case-2/modx-case-2-7.png)

And added a new block to its HTML code by modifying the Technicians block:

```html:line-numbers
            <h2 class="doljnost-text">Client Relations Manager</h2>
            <div class="row">
                [[!getImageList?
                  &tvname=`client-manager-images`
                  &tpl=`client-manager-imageTpl`
                  &toPlaceholder=`client-manager-imageTpl`
                ]]
                [[!+client-manager-imageTpl]]
            </div>
```

Next, I saved the template.

I checked the result under Resources -> Our Team -> Template Variables -> Our Team:

![](/ru/images/modx-case-2/modx-case-2-8.png)

The new block I had added appeared:

![](/ru/images/modx-case-2/modx-case-2-9.png)

Next, I added the Purchasing Manager block in the same way.

After that, I filled the blocks with new photographs.

## Result

As a result, the page structure was expanded with two new blocks that were fully integrated into the administration panel. This gives the client complete autonomy over content management and eliminates the need to involve a developer in future updates.
