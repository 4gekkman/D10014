<?php

return [

    //-------------//
    // 1] Routing  //
    //-------------//
    // - Don't touch the strings "routing start" / "routing end" below,
    //   otherwise smth will break.
    // - Routing system supports max 50 uri segments and 10 subdomains.
    // - Routing system supports 2 protocols: 'http' and 'https'.
    // - All subdomains should end in a dot. Example: "sub2.sub1."
    // - Subdomain '' means an absence of subdomains.
    // - All segments should start in a forward slash. Example: "/users"
    // - If you'll manually edit the array below, the changes will take effect only
    //   after the console command "m1:parseapp" will be invoked.
    // - MIN available structure example (url in example - http://domain.ru):
    /**
     *    'routing' => [
     *      'domain.ru' => [
     *        'http' => [
     *          '' => [
     *            '/'
     *          ]
     *        ]
     *      ]
     *    ]
     */
    // routing start
    'routing' => [
      'localhost' => [
        'http' => [
          '' => [
            '/d10014'
          ]
        ]
      ]
    ],
    // routing end

    //-----------------//
    // 2] Локализация  //
    //    localization //
    //-----------------//

      // 2.1] Поддерживаемые пакетом локали | The locales that are supported by the package //
      //------------------------------------------------------------------------------------//
      'locales' => ['RU', 'EN'],

      // 2.2] Выбранная локаль | Chosen locale //
      //---------------------------------------//
      // - If the value is empty, uses config('app.locale')
      // - Else if config('app.locale') not in 'locales', uses 1-st of 'locales'
      // - Else if 1-st of 'locales' is empty, uses 'RU'.
      'locale' => '',

    //------------------------------//
    // 3] Имя и описание пакета     //
    //    Locale of package         //
    //------------------------------//
    'aboutpack' => [
      'RU' => [
        'name'        => 'Affiliate program',
        'description' => 'Affiliate program',
      ],
      'EN' => [
        'name'        => 'Affiliate program',
        'description' => 'Affiliate program',
      ]
    ],

    //-------------------------------------------------------------------------//
    // 4] История обновлений конфига пакета. Не редактировать вручную.         //
    //    History of updates of config of the package. Don't edit it manually. //
    //-------------------------------------------------------------------------//
    'cnfupdshistory'    => [],

];
