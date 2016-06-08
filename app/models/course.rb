class Course < ActiveRecord::Base
  has_many :lectures
  has_many :tutorials

  has_many :user_course_selections
  has_many :users, through: :user_course_selections
end
