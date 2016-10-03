describe('my app', function() {
    it('should have a title and have 1 point after adding, checking text, deleting the point', function() {
        browser.get("http://127.0.0.1:8000/");
        expect(browser.getTitle()).toEqual('Редактор маршрутов');

        element(by.model('newPoint')).sendKeys(1);
        element(by.model('newPoint')).sendKeys(protractor.Key.ENTER);

//        element(by.id('gobutton')).click();

        expect(element.all(by.repeater('point in points')).count()).toEqual(1);

        expect(element(by.css('li.list_element:first-of-type')).getText()).toEqual('1');

        element(by.css('li.list_element:first-of-type > span > img.delete_point')).click()
        expect(element.all(by.repeater('point in points')).count()).toEqual(0);
    });

    it('have 2 points after adding', function() {
        browser.get("http://127.0.0.1:8000/");

        element(by.model('newPoint')).sendKeys(1);
        element(by.model('newPoint')).sendKeys(protractor.Key.ENTER);

        element(by.model('newPoint')).sendKeys(11);
        element(by.model('newPoint')).sendKeys(protractor.Key.ENTER);

        expect(element.all(by.repeater('point in points')).count()).toEqual(2);
    });


});
