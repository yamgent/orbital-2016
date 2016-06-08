class User < ActiveRecord::Base
  has_secure_password

  has_many :user_course_selections
  has_many :courses, through: :user_course_selections
end
