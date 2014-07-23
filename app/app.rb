#!/usr/bin/env ruby
require 'rubygems'
require 'sinatra'
require 'data_mapper'

class App < Sinatra::Application

  configure do
    use Rack::Deflater

    DataMapper.setup(:default, ENV['DATABASE'] || 'mysql://root@localhost/emf')

    Dir[File.join(File.dirname(__FILE__), "/models/*.rb")].each do |file|
      require file
    end

    DataMapper.finalize.auto_upgrade!
  end

  get "/" do
    "coming soon"
  end

end
