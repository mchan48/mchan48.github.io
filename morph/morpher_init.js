function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

(function () {
    var source_images = ['00', '01', '02', '03', '04', '05', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16',
        '17', '18', '20', '21', '22', '23', '24', '26', '27', '28', '30', '31', '32', '33', '34', '35', '36', '37',
        '38', '39', '40', '41', '42', '43', '44', '46', '47', '48', '49'];
    var easy_length = 8;
    var hard_length = 24;

    function get_data(max_size) {
        shuffle(source_images);
        var max = source_images.length;
        var data = [];
        var i;
        for (i = 0; i < max; i++) {
            data.push({index: i, 'images': [image_desc[source_images[max - 1]], image_desc[source_images[i]]]});
            data.push({index: i, 'images': [image_desc[source_images[max - 1]], image_desc[source_images[i]]]});
            if (data.length == max_size) {
                break;
            }
        }
        shuffle(data);
        return data;
    }
    function create_morphers(data) {
        var morphers = [];
        for (var i = 0; i < data.length; i++) {
            var images = data[i]['images'];
            var json = {
                "images": images,
                "triangles": triangles

            };
            var morpher = new Morpher(json);
            morpher.id = data[i]['index'];
            morphers.push(morpher);
        }
        return morphers;
    }
    function draw_photos(morphers) {
        var npairs = morphers.length / 2;
        var correct_pairs = 0;
        $('#score').text('0%');
        for (var i = 0; i < morphers.length; i++) {
            var morpher = morphers[i];
            morpher.canvas.morpher = morpher;
            morpher.canvas.id = morpher.id;
            $('#body').prepend(morpher.canvas);
        }
        $('canvas').each(function (index, canvas) {
            canvas.morpher.on("animation:complete", function (morpher, canvas) {
                var actives = $('canvas.active');
                if (actives.length == 2) {
                    console.log(actives[0].id, actives[1].id);
                    $(actives[0]).removeClass('active');
                    $(actives[1]).removeClass('active');
                    if (actives[0].id != actives[1].id) {
                        // fail
                        actives[1].morpher.set([0, 1]);
                        actives[0].morpher.set([0, 1]);
                        actives[0].morpher.animate([1, 0], 800);
                        actives[1].morpher.animate([1, 0], 800);

                    } else {
                        // success
                        correct_pairs++;
                        var percent = Math.round(correct_pairs * 100 / npairs);
                        $('#score').text('' + percent + '%');
                        $(actives[0]).addClass('done');
                        $(actives[1]).addClass('done');
                    }
                }
            });
            canvas.addEventListener('click', function () {
                if ($(this).hasClass('done') || $(this).hasClass('active')) {
                    console.log(this.id, 'is finished');
                    return;
                }
                this.morpher.set([1, 0]);
                this.morpher.animate([0, 1], 1000);
                $(this).addClass('active');

            }, false);
        });
    }
    $(document).ready(function () {
        var data = get_data(easy_length);
        draw_photos(create_morphers(data));
        $('#body').append($('<ul class="control nav nav-pills nav-stacked"><a id="reset" href="javascript:void(0);"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></a><li id="easy" class="active"><a href="#">Easy</a></li> <li id="hard"><a href="#">Hard</a></li></ul>'));
        $('#body').append($('<ul class="score nav nav-pills nav-stacked" style="padding-top: 10px;"><li><p>Score</p></li><li><p id="score">0%</p></li></ul>'));
        $('#reset').on('click', function () {
            $("canvas").remove();
            var l;
            if ($('#easy').hasClass('active')) {
                l = easy_length;
            } else {
                l = hard_length;
            }
            var data = get_data(l);
            draw_photos(create_morphers(data));

        });
        $('#easy').on('click', function () {
            if (!$('#easy').hasClass('active')) {
                $('#easy').toggleClass('active');
                $('#hard').toggleClass('active');
                $("canvas").remove();
                $('#body').width(340);
                var data = get_data(easy_length);
                draw_photos(create_morphers(data));
            }
        });
        $('#hard').on('click', function () {
            if (!$('#hard').hasClass('active')) {
                $('#easy').toggleClass('active');
                $('#hard').toggleClass('active');
                $("canvas").remove();
                $('#body').width(500);
                var data = get_data(hard_length);
                draw_photos(create_morphers(data));
            }
        });
    });
})();
