# Editing Field Properties in an Order Form

The client needed to change the properties of several fields in the order form.

![](/ru/images/modx-case-1/modx-case-1-1.png)

For tooth color selection, the dropdown palette needed to be replaced with free-text input fields with validation:

<figure>
  <img src="/ru/images/modx-case-1/modx-case-1-2.png">
  <figcaption>Demonstration of a field for selecting a color from a palette</figcaption>
</figure>

To solve this task, I received access from the client to the super-admin account because only this high-level user had permission to edit the form.

In the administration panel, I went to the Resources section and selected the required page:

![](/ru/images/modx-case-1/modx-case-1-3.png)

I opened the only child resource by clicking the "Edit" button:

![](/ru/images/modx-case-1/modx-case-1-4.png)

And identified the template name:

![](/ru/images/modx-case-1/modx-case-1-5.png)

The "Form to Fill Out" template.

Next, in the Elements section, I examined the Templates section:

![](/ru/images/modx-case-1/modx-case-1-6.png)

There I found the form template that needed to be edited:

![](/ru/images/modx-case-1/modx-case-1-7.png)

Next, in the template's HTML code, I determined that the form was loaded from the `contactFormTpl` chunk:

![](/ru/images/modx-case-1/modx-case-1-8.png)

In the Elements section, under Chunks, I found the required chunk:

![](/ru/images/modx-case-1/modx-case-1-9.png)

I examined the chunk's HTML code:

![](/ru/images/modx-case-1/modx-case-1-10.png)

And determined that the form was loaded from a chunk named `defaultForm1`.

Next, in the same Chunks section, I found `defaultForm1`:

![](/ru/images/modx-case-1/modx-case-1-11.png)

Examining its HTML code showed that this was the final point where editing would change the page content:

![](/ru/images/modx-case-1/modx-case-1-12.png)

Next, I backed up the chunk code so that I could return to the original state in case of unforeseen circumstances:

![](/ru/images/modx-case-1/modx-case-1-13.png)

Then I began editing the page.

I determined that the `type="color"` parameter in the input element was responsible for displaying the palette:

```html
<input id="qult-color"
       type="color"
       class="color3-box form-control[[!+fi.error.bok-color:notempty=` error`]]"
       name="qult-color"
       value="#3d41a6">
```

I replaced it with `type="text"`, removing unnecessary parameters and adding a default field description:

```html
<input id="qult-color"
       type="text"
       maxlength="15"
       class="form-control[[!+fi.error.qult-color:notempty=` error`]]"
       name="qult-color"
       placeholder="For example: yellow, dark, A1, A2">
```

A limit on the length of the entered text was also added.

In the form that required more precise data entry:

```html
<div class="col-md-12 col-lg-9">
   <input id="bok-color"
          type="color"
          class="color3-box form-control[[!+fi.error.bok-color:notempty=` error`]]"
          name="bok-color"
          value="#3d41a6">
</div>
```

I added validation for input field values:

```html
<div class="col-md-12 col-lg-9">
    <input id="bok-color"
           type="text"
           required
           class="form-control[[!+fi.error.bok-color:notempty=` error`]]"
           name="bok-color"
           placeholder="Only VITA shade values are allowed: A1–A4, A3.5, B1–B4, C1–C4, D1–D4, BL1–BL4"
           pattern="^(A(1|2|3(\.5)?|4)|[BCD](1|2|3|4)|BL(1|2|3|4))">
</div>
```

I did the same with the other similar fields.

Next, I clicked the Save button at the top of the chunk editing page:

![](/ru/images/modx-case-1/modx-case-1-14.png)

After that, I checked the result on the page:

![](/ru/images/modx-case-1/modx-case-1-15.png)

![](/ru/images/modx-case-1/modx-case-1-16.png)

The changes were applied as expected.

Interactivity was also added to data entry using CSS:

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

As soon as users enter data in a field, they can see whether it will pass validation when the form is submitted:

<figure>
  <img src="/ru/images/modx-case-1/modx-case-1-17.png" alt="Invalid value">
  <figcaption>An invalid value highlights the input field in red</figcaption>
</figure>

<figure>
  <img src="/ru/images/modx-case-1/modx-case-1-18.png" alt="Valid value">
  <figcaption>A valid value is highlighted in green</figcaption>
</figure>

This CSS code also accounts for the presence of data: an empty field is not highlighted.

Next, I filled out the form with test data, submitted it, and verified that the data from the modified fields was saved:

![](/ru/images/modx-case-1/modx-case-1-19.png)

The test was successful.

After that, the client received a report on the changes made.
